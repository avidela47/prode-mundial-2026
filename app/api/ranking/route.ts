import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { PARTIDOS, PUNTOS_SIGNO, PUNTOS_EXACTO } from '@/lib/fixture';

const DB = 'prode-mundial2026';

function calcSigno(gl: number, gv: number): '1' | 'X' | '2' {
  if (gl > gv) return '1';
  if (gl === gv) return 'X';
  return '2';
}

interface Jugador { id: string; nombre: string; color: string; esAdmin: boolean; }
interface Pred { jugadorId: string; partidoId: string; valor: string; }
interface Resultado { partidoId: string; gl: number; gv: number; }

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB);

    const [jugadoresRaw, predsRaw, resRaw] = await Promise.all([
      db.collection('jugadores').find({}).toArray(),
      db.collection('predicciones').find({}).toArray(),
      db.collection('resultados').find({}).toArray(),
    ]);

    const jugadores = jugadoresRaw as unknown as Jugador[];
    const predicciones = predsRaw as unknown as Pred[];
    const resultados = resRaw as unknown as Resultado[];

    const resMap: Record<string, { gl: number; gv: number; signo: '1' | 'X' | '2' }> = {};
    for (const r of resultados) {
      resMap[r.partidoId] = { gl: r.gl, gv: r.gv, signo: calcSigno(r.gl, r.gv) };
    }

    const ranking = jugadores
      .filter(j => !j.esAdmin)
      .map(j => {
        const misPreds = predicciones.filter(p => p.jugadorId === j.id);
        let puntos = 0, aciertos = 0, jugados = 0;

        for (const pred of misPreds) {
          const res = resMap[pred.partidoId];
          if (!res) continue;
          jugados++;

          const partido = PARTIDOS.find(p => p.id === pred.partidoId);
          const fase = partido?.fase ?? 'grupos';

          if (pred.valor.includes('-')) {
            const [pGl, pGv] = pred.valor.split('-').map(Number);
            if (pGl === res.gl && pGv === res.gv) {
              puntos += PUNTOS_EXACTO[fase];
              aciertos++;
            } else if (calcSigno(pGl, pGv) === res.signo) {
              puntos += PUNTOS_SIGNO[fase];
              aciertos++;
            }
          } else {
            if (pred.valor === res.signo) {
              puntos += PUNTOS_SIGNO[fase];
              aciertos++;
            }
          }
        }

        return { id: j.id, nombre: j.nombre, color: j.color, puntos, aciertos, jugados };
      });

    ranking.sort((a, b) => b.puntos - a.puntos || b.aciertos - a.aciertos);
    return NextResponse.json(ranking);
  } catch {
    return NextResponse.json({ error: 'Error al calcular ranking' }, { status: 500 });
  }
}