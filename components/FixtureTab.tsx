'use client';
import { useState, useEffect } from 'react';
import { PARTIDOS, GRUPOS_LIST, type Partido } from '@/lib/fixture';
import { PartidoCard } from './PartidoCard';
import { useProdeStore } from '@/lib/store';

export function FixtureTab() {
  const [grupoActivo, setGrupoActivo] = useState<string>('hoy');
  const { init } = useProdeStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void init(); }, []);

  function esHoy(fechaISO: string): boolean {
    const ahora = new Date();
    const partido = new Date(fechaISO);
    // Comparar en hora Argentina (UTC-3)
    const ahoraARG = new Date(ahora.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    const partidoARG = new Date(partido.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    return ahoraARG.getDate() === partidoARG.getDate() &&
      ahoraARG.getMonth() === partidoARG.getMonth() &&
      ahoraARG.getFullYear() === partidoARG.getFullYear();
  }

  const filtrados = grupoActivo === 'todos'
    ? PARTIDOS.filter(p => p.fase === 'grupos')
    : grupoActivo === 'hoy'
    ? PARTIDOS.filter(p => p.fase === 'grupos' && esHoy(p.fechaISO))
    : PARTIDOS.filter(p => p.grupo === grupoActivo);

  const porGrupo: Record<string, Partido[]> = {};
  filtrados.forEach(p => {
    const key = p.grupo ?? 'SIN GRUPO';
    if (!porGrupo[key]) porGrupo[key] = [];
    porGrupo[key].push(p);
  });

  return (
    <div>
      <div style={{
        display: 'flex', gap: 6,
        overflowX: 'auto', paddingBottom: 10, marginBottom: 20,
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}>
        <button className={`filter-btn${grupoActivo === 'hoy' ? ' active' : ''}`}
          onClick={() => setGrupoActivo('hoy')}>
          HOY
        </button>
        <button className={`filter-btn${grupoActivo === 'todos' ? ' active' : ''}`}
          onClick={() => setGrupoActivo('todos')}>
          TODOS
        </button>
        {GRUPOS_LIST.map(g => (
          <button key={g}
            className={`filter-btn${grupoActivo === g ? ' active' : ''}`}
            onClick={() => setGrupoActivo(g)}>
            {g}
          </button>
        ))}
      </div>

      {filtrados.length === 0 && grupoActivo === 'hoy' && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 14 }}>
          No hay partidos hoy
        </div>
      )}

      {Object.entries(porGrupo).map(([grupo, ps]) => (
        <div key={grupo} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="group-pill">{grupo}</span>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: '0.05em' }}>
              GRUPO {grupo}
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: 8,
          }}>
            {ps.map(p => <PartidoCard key={p.id} partido={p} />)}
          </div>
        </div>
      ))}
    </div>
  );
}