'use client';

import { useEffect } from 'react';
import { useProdeStore } from '@/lib/store';
import { PARTIDOS } from '@/lib/fixture';

export function TablaTab() {
  const { jugadores, jugadorActivo, getRanking, init } = useProdeStore();
  const ranking = getRanking();
  const jugados = Object.keys(useProdeStore.getState().resultados).length;

  useEffect(() => { void init(); }, []);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Partidos jugados', value: jugados, of: PARTIDOS.length },
          { label: 'Participantes', value: jugadores.length },
          { label: 'Puntos en juego', value: (PARTIDOS.length - jugados) * 3 },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 12px' }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: 'var(--gold)', lineHeight: 1 }}>
              {s.value}{s.of !== undefined && <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/{s.of}</span>}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Ranking */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div className="ranking-grid" style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', fontSize: 11, fontFamily: 'Barlow Condensed', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          <div>#</div>
          <div>Participante</div>
          <div style={{ textAlign: 'center' }}>Jugados</div>
          <div style={{ textAlign: 'center' }}>Aciertos</div>
          <div style={{ textAlign: 'center' }}>Pts</div>
        </div>

        {ranking.map((j, i) => (
          <div key={j.id} className="ranking-grid" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: i === 0 && j.puntos > 0 ? 'rgba(201,168,76,0.06)' : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {i === 0 && j.puntos > 0 ? '🥇' : i === 1 && j.puntos > 0 ? '🥈' : i === 2 && j.puntos > 0 ? '🥉' : (
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{i + 1}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${j.color}22`, border: `1px solid ${j.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: j.color, flexShrink: 0 }}>
                {j.nombre.substring(0, 2).toUpperCase()}
              </div>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{j.nombre}</span>
              {j.esAdmin && <span className="badge" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>Admin</span>}
              {jugadorActivo?.id === j.id && <span className="badge" style={{ background: 'rgba(0,154,85,0.15)', color: '#00D46A', border: '1px solid rgba(0,212,106,0.3)' }}>Vos</span>}
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>{j.jugados}</div>
            <div style={{ textAlign: 'center', fontSize: 13, color: '#00D46A' }}>{j.aciertos}</div>
            <div style={{ textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 22, color: i === 0 && j.puntos > 0 ? 'var(--gold)' : 'var(--text)' }}>{j.puntos}</div>
          </div>
        ))}

        {ranking.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            No hay participantes todavía
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
        Grupos: 3pts · 1/16 y Octavos: 5pts · Cuartos y Semis: 8pts · Final: 10pts
      </div>
    </div>
  );
}