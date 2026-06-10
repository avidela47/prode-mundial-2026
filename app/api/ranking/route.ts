import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { PARTIDOS, PUNTOS_SIGNO } from '@/lib/fixture';

const DB = 'prode-mundial2026';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB);

    const [jugadores, predicciones, resultados] = await Promise.all([
      db.collection('jugadores').find({}).toArray(),
      db.collection('predicciones').find({}).toArray(),
      db.collection('resultados').find({}).toArray(),
    ]);

    // Mapa de resultados reales { partidoId: '1'|'X'|'2' }
    const resMap: Record<string, '1' | 'X' | '2'> = {};
    for (const r of resultados) {
      if (r.gl > r.gv) resMap[r.partidoId] = '1';
      else if (r.gl === r.gv) resMap[r.partidoId] = 'X';
      else resMap[r.partidoId] = '2';
    }

    // Calcular puntos por jugador
    const ranking = jugadores.map(j => {
      const misPreds = predicciones.filter(p => p.jugadorId === j.id);
      let puntos = 0, aciertos = 0, jugados = 0;

      for (const pred of misPreds) {
        const resReal = resMap[pred.partidoId];
        if (!resReal) continue;
        jugados++;
        if (pred.valor === resReal) {
          const partido = PARTIDOS.find(p => p.id === pred.partidoId);
          const fase = partido?.fase ?? 'grupos';
          puntos += PUNTOS_SIGNO[fase];
          aciertos++;
        }
      }

      return {
        id: j.id,
        nombre: j.nombre,
        color: j.color,
        esAdmin: j.esAdmin,
        puntos,
        aciertos,
        jugados,
        totalPreds: misPreds.length,
      };
    });

    ranking.sort((a, b) => b.puntos - a.puntos || b.aciertos - a.aciertos);
    return NextResponse.json(ranking);
  } catch {
    return NextResponse.json({ error: 'Error al calcular ranking' }, { status: 500 });
  }
}