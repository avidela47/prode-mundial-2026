'use client';
import { useState, useEffect } from 'react';
import { PARTIDOS, GRUPOS_LIST, type Partido } from '@/lib/fixture';
import { PartidoCard } from './PartidoCard';
import { useProdeStore } from '@/lib/store';

export function FixtureTab() {
  const [seccion, setSeccion] = useState<'grupos' | '1/16' | 'octavos' | 'cuartos' | 'semis'>('grupos');
  const [grupoActivo, setGrupoActivo] = useState<string>('hoy');
  const { init } = useProdeStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void init(); }, []);

  function esHoy(fechaISO: string): boolean {
    const ahora = new Date();
    const ahoraARG = new Date(ahora.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    const partidoARG = new Date(new Date(fechaISO).toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    return ahoraARG.getDate() === partidoARG.getDate() &&
      ahoraARG.getMonth() === partidoARG.getMonth() &&
      ahoraARG.getFullYear() === partidoARG.getFullYear();
  }

  const partidos16 = PARTIDOS.filter(p => p.fase === '1/16');
  const partidosOctavos = PARTIDOS.filter(p => p.fase === 'octavos');
  const partidosCuartos = PARTIDOS.filter(p => p.fase === 'cuartos');
  const partidosSemis = PARTIDOS.filter(p => p.fase === 'semis');

  const filtrados = seccion === '1/16'
    ? partidos16
    : seccion === 'octavos'
    ? partidosOctavos
    : seccion === 'cuartos'
    ? partidosCuartos
    : seccion === 'semis'
    ? partidosSemis
    : grupoActivo === 'todos'
    ? PARTIDOS.filter(p => p.fase === 'grupos')
    : grupoActivo === 'hoy'
    ? PARTIDOS.filter(p => (p.fase === 'grupos' || p.fase === '1/16' || p.fase === 'octavos' || p.fase === 'cuartos' || p.fase === 'semis') && esHoy(p.fechaISO))
    : PARTIDOS.filter(p => p.grupo === grupoActivo);

  const porGrupo: Record<string, Partido[]> = {};
  if (seccion === 'grupos' && grupoActivo !== 'hoy') {
    filtrados.forEach(p => {
      const key = p.grupo ?? 'SIN GRUPO';
      if (!porGrupo[key]) porGrupo[key] = [];
      porGrupo[key].push(p);
    });
  }

  return (
    <div>
      {/* Sección grupos / 1/16 / octavos / cuartos / semis */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={() => { setSeccion('grupos'); setGrupoActivo('hoy'); }}
          style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            borderColor: seccion === 'grupos' ? 'var(--blue)' : 'var(--border)',
            background: seccion === 'grupos' ? 'var(--blue)' : '#fff',
            color: seccion === 'grupos' ? '#fff' : 'var(--text-muted)',
          }}>
          FASE DE GRUPOS
        </button>
        <button onClick={() => setSeccion('1/16')}
          style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            borderColor: seccion === '1/16' ? 'var(--blue)' : 'var(--border)',
            background: seccion === '1/16' ? 'var(--blue)' : '#fff',
            color: seccion === '1/16' ? '#fff' : 'var(--text-muted)',
          }}>
          16AVOS
        </button>
        <button onClick={() => setSeccion('octavos')}
          style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            borderColor: seccion === 'octavos' ? 'var(--blue)' : 'var(--border)',
            background: seccion === 'octavos' ? 'var(--blue)' : '#fff',
            color: seccion === 'octavos' ? '#fff' : 'var(--text-muted)',
          }}>
          OCTAVOS
        </button>
        <button onClick={() => setSeccion('cuartos')}
          style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            borderColor: seccion === 'cuartos' ? 'var(--blue)' : 'var(--border)',
            background: seccion === 'cuartos' ? 'var(--blue)' : '#fff',
            color: seccion === 'cuartos' ? '#fff' : 'var(--text-muted)',
          }}>
          CUARTOS
        </button>
        <button onClick={() => setSeccion('semis')}
          style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            borderColor: seccion === 'semis' ? 'var(--blue)' : 'var(--border)',
            background: seccion === 'semis' ? 'var(--blue)' : '#fff',
            color: seccion === 'semis' ? '#fff' : 'var(--text-muted)',
          }}>
          SEMIS
        </button>
      </div>

      {/* Filtros grupos */}
      {seccion === 'grupos' && (
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, marginBottom: 20, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <button className={`filter-btn${grupoActivo === 'hoy' ? ' active' : ''}`} onClick={() => setGrupoActivo('hoy')}>HOY</button>
          <button className={`filter-btn${grupoActivo === 'todos' ? ' active' : ''}`} onClick={() => setGrupoActivo('todos')}>TODOS</button>
          {GRUPOS_LIST.map(g => (
            <button key={g} className={`filter-btn${grupoActivo === g ? ' active' : ''}`} onClick={() => setGrupoActivo(g)}>{g}</button>
          ))}
        </div>
      )}

      {/* Sin partidos */}
      {filtrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 14 }}>
          No hay partidos {seccion === 'grupos' && grupoActivo === 'hoy' ? 'hoy' : ''}
        </div>
      )}

      {/* 16avos — lista directa */}
      {seccion === '1/16' && filtrados.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ background: 'var(--blue)', color: '#fff', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 13, padding: '3px 10px', borderRadius: 6 }}>1/16</span>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text)' }}>ELIMINACIÓN DIRECTA</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 8 }}>
            {partidos16.map(p => <PartidoCard key={p.id} partido={p} />)}
          </div>
        </div>
      )}

      {/* Octavos — lista directa */}
      {seccion === 'octavos' && filtrados.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ background: 'var(--blue)', color: '#fff', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 13, padding: '3px 10px', borderRadius: 6 }}>8vos</span>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text)' }}>OCTAVOS DE FINAL</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 8 }}>
            {partidosOctavos.map(p => <PartidoCard key={p.id} partido={p} />)}
          </div>
        </div>
      )}

      {/* Cuartos — lista directa */}
      {seccion === 'cuartos' && filtrados.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ background: 'var(--blue)', color: '#fff', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 13, padding: '3px 10px', borderRadius: 6 }}>4tos</span>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text)' }}>CUARTOS DE FINAL</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 8 }}>
            {partidosCuartos.map(p => <PartidoCard key={p.id} partido={p} />)}
          </div>
        </div>
      )}

      {/* Semis — lista directa */}
      {seccion === 'semis' && filtrados.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ background: 'var(--blue)', color: '#fff', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 13, padding: '3px 10px', borderRadius: 6 }}>Semis</span>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text)' }}>SEMIFINALES</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 8 }}>
            {partidosSemis.map(p => <PartidoCard key={p.id} partido={p} />)}
          </div>
        </div>
      )}

      {/* Grupos — por grupo */}
      {seccion === 'grupos' && grupoActivo !== 'hoy' && Object.entries(porGrupo).map(([grupo, ps]) => (
        <div key={grupo} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="group-pill">{grupo}</span>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>GRUPO {grupo}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 8 }}>
            {ps.map(p => <PartidoCard key={p.id} partido={p} />)}
          </div>
        </div>
      ))}

      {/* HOY — lista directa */}
      {seccion === 'grupos' && grupoActivo === 'hoy' && filtrados.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 8 }}>
          {filtrados.map(p => <PartidoCard key={p.id} partido={p} />)}
        </div>
      )}
    </div>
  );
}