'use client';

import { useState } from 'react';
import { useProdeStore } from '@/lib/store';
import { PARTIDOS } from '@/lib/fixture';

export function TablaTab() {
  const { jugadores, jugadorActivo, addJugador, removeJugador, getRanking } = useProdeStore();
  const [newName, setNewName] = useState('');
  const [newDni, setNewDni] = useState('');
  const [newEsAdmin, setNewEsAdmin] = useState(false);
  const ranking = getRanking();
  const jugados = Object.keys(useProdeStore.getState().resultados).length;
  const esAdmin = jugadorActivo?.esAdmin;

  function handleAdd() {
    const n = newName.trim();
    const d = newDni.trim();
    if (!n || d.length !== 4) return;
    addJugador(n, d, newEsAdmin);
    setNewName('');
    setNewDni('');
    setNewEsAdmin(false);
  }

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Partidos jugados', value: jugados, of: PARTIDOS.length },
          { label: 'Participantes', value: jugadores.length },
          { label: 'Puntos en juego', value: (PARTIDOS.length - jugados) * 3 },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px 20px',
          }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: 'var(--gold)', lineHeight: 1 }}>
              {s.value}{s.of !== undefined && <span style={{ fontSize: 18, color: 'var(--text-muted)' }}>/{s.of}</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Admin: agregar jugador */}
      {esAdmin && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'Barlow Condensed', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Agregar participante
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nombre..."
              maxLength={20}
              style={{
                flex: 2, minWidth: 140, height: 40,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8, padding: '0 14px',
                color: 'var(--text)', fontSize: 14,
              }}
            />
            <input
              value={newDni}
              onChange={e => setNewDni(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="4 dígitos DNI"
              maxLength={4}
              style={{
                flex: 1, minWidth: 120, height: 40,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8, padding: '0 14px',
                color: 'var(--text)', fontSize: 14,
              }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={newEsAdmin}
                onChange={e => setNewEsAdmin(e.target.checked)}
              />
              Admin
            </label>
            <button
              onClick={handleAdd}
              style={{
                height: 40, padding: '0 20px',
                background: 'var(--gold)', color: '#000',
                border: 'none', borderRadius: 8,
                fontFamily: 'Barlow Condensed', fontWeight: 700,
                fontSize: 15, letterSpacing: '0.05em', cursor: 'pointer',
              }}
            >
              + AGREGAR
            </button>
          </div>
        </div>
      )}

      {/* Ranking table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px 80px',
          padding: '10px 16px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid var(--border)',
          fontSize: 11, fontFamily: 'Barlow Condensed', fontWeight: 700,
          letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)',
        }}>
          <div>#</div>
          <div>Participante</div>
          <div style={{ textAlign: 'center' }}>Jugados</div>
          <div style={{ textAlign: 'center' }}>Aciertos</div>
          <div style={{ textAlign: 'center' }}>Puntos</div>
        </div>

        {ranking.map((j, i) => (
          <div key={j.id} style={{
            display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px 80px',
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            alignItems: 'center',
            background: i === 0 && j.puntos > 0 ? 'rgba(201,168,76,0.06)' : undefined,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {i === 0 && j.puntos > 0 ? '🥇' : i === 1 && j.puntos > 0 ? '🥈' : i === 2 && j.puntos > 0 ? '🥉' : (
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--surface2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'var(--text-muted)',
                }}>{i + 1}</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `${j.color}22`,
                border: `1px solid ${j.color}66`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: j.color, flexShrink: 0,
              }}>
                {j.nombre.substring(0, 2).toUpperCase()}
              </div>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{j.nombre}</span>
              {j.esAdmin && (
                <span className="badge" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>
                  Admin
                </span>
              )}
              {esAdmin && j.id !== jugadorActivo?.id && (
                <button
                  onClick={() => removeJugador(j.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, marginLeft: 'auto' }}
                  title="Eliminar"
                >
                  ×
                </button>
              )}
            </div>

            <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>{j.jugados}</div>
            <div style={{ textAlign: 'center', fontSize: 14, color: '#00D46A' }}>{j.aciertos}</div>
            <div style={{ textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 24, color: i === 0 && j.puntos > 0 ? 'var(--gold)' : 'var(--text)' }}>
              {j.puntos}
            </div>
          </div>
        ))}

        {ranking.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No hay participantes todavía
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        Grupos: 3pts · 1/16 y Octavos: 5pts · Cuartos y Semis: 8pts · Final: 10pts
      </div>
    </div>
  );
}