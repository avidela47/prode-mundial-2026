'use client';

import { useState, useEffect } from 'react';
import { PARTIDOS, GRUPOS_LIST, FASES_LABEL, type Fase, type Partido } from '@/lib/fixture';
import { useProdeStore } from '@/lib/store';
import { PartidoCard } from './PartidoCard';

const FASES_ELIMINACION: Fase[] = ['1/16', 'octavos', 'cuartos', 'semis', '3er_puesto', 'final'];

interface Jugador { id: string; nombre: string; color: string; }
interface Pred { jugadorId: string; partidoId: string; valor: string; }

function PredsPartido({ partido, jugadores, preds }: { partido: Partido; jugadores: Jugador[]; preds: Pred[] }) {
  const misPreds = preds.filter(p => p.partidoId === partido.id);
  if (misPreds.length === 0) return null;

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', marginTop: 8 }}>
      <div style={{ fontSize: 10, fontFamily: 'Barlow Condensed', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
        Predicciones
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {jugadores.map(j => {
          const pred = misPreds.find(p => p.jugadorId === j.id);
          if (!pred) return (
            <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${j.color}22`, border: `1px solid ${j.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: j.color, flexShrink: 0 }}>
                {j.nombre.substring(0, 2).toUpperCase()}
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{j.nombre}</span>
              <span style={{ fontSize: 11, color: '#4A5568', marginLeft: 'auto' }}>Sin apuesta</span>
            </div>
          );

          let display = pred.valor;
          let signo = pred.valor;
          if (pred.valor.includes('-')) {
            const [gl, gv] = pred.valor.split('-').map(Number);
            display = `${gl} - ${gv}`;
            signo = gl > gv ? '1' : gl === gv ? 'X' : '2';
          }
          const signoLabel = signo === '1' ? partido.local : signo === 'X' ? 'Empate' : partido.visita;

          return (
            <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${j.color}22`, border: `1px solid ${j.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: j.color, flexShrink: 0 }}>
                {j.nombre.substring(0, 2).toUpperCase()}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{j.nombre}</span>
              <span style={{ fontSize: 12, color: 'var(--gold)', fontFamily: 'Bebas Neue', letterSpacing: 1, marginLeft: 'auto' }}>{display}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontWeight: 600 }}>({signoLabel})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ResultadosTab() {
  const { jugadorActivo } = useProdeStore();
  const [grupoActivo, setGrupoActivo] = useState<string>('A');
  const [faseActiva, setFaseActiva] = useState<Fase>('1/16');
  const [seccion, setSeccion] = useState<'grupos' | 'eliminacion'>('grupos');
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [preds, setPreds] = useState<Pred[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/usuarios').then(r => r.json()),
      fetch('/api/predicciones').then(r => r.json()),
    ]).then(([j, p]) => { setJugadores(j); setPreds(p); });
  }, []);

  const esAdmin = jugadorActivo?.esAdmin === true;

  const filtrados = seccion === 'grupos'
    ? PARTIDOS.filter(p => p.grupo === grupoActivo)
    : PARTIDOS.filter(p => p.fase === faseActiva);

  return (
    <div>
      {esAdmin && (
        <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚽</span>
          <span style={{ fontSize: 14, color: 'var(--gold)' }}>Ingresá los resultados reales para calcular los puntos automáticamente.</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['grupos', 'eliminacion'] as const).map(s => (
          <button key={s} onClick={() => setSeccion(s)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid', borderColor: seccion === s ? 'var(--gold)' : 'rgba(255,255,255,0.1)', background: seccion === s ? 'rgba(201,168,76,0.15)' : 'transparent', color: seccion === s ? 'var(--gold)' : 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em', cursor: 'pointer' }}>
            {s === 'grupos' ? 'FASE DE GRUPOS' : 'ELIMINACIÓN DIRECTA'}
          </button>
        ))}
      </div>

      {seccion === 'grupos' ? (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 24 }}>
          {GRUPOS_LIST.map(g => (
            <button key={g} onClick={() => setGrupoActivo(g)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', borderColor: grupoActivo === g ? 'var(--gold)' : 'rgba(255,255,255,0.1)', background: grupoActivo === g ? 'rgba(201,168,76,0.15)' : 'transparent', color: grupoActivo === g ? 'var(--gold)' : 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Grupo {g}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 24 }}>
          {FASES_ELIMINACION.map(f => (
            <button key={f} onClick={() => setFaseActiva(f)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', borderColor: faseActiva === f ? 'var(--gold)' : 'rgba(255,255,255,0.1)', background: faseActiva === f ? 'rgba(201,168,76,0.15)' : 'transparent', color: faseActiva === f ? 'var(--gold)' : 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {FASES_LABEL[f]}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtrados.map(p => (
          <div key={p.id}>
            <PartidoCard partido={p} showResultInput={esAdmin} />
            <PredsPartido partido={p} jugadores={jugadores} preds={preds} />
          </div>
        ))}
      </div>
    </div>
  );
}