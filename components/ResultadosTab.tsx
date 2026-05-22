'use client';

import { useState } from 'react';
import { PARTIDOS, GRUPOS_LIST, FASES_LABEL, type Fase } from '@/lib/fixture';
import { useProdeStore } from '@/lib/store';
import { PartidoCard } from './PartidoCard';

const FASES_ELIMINACION: Fase[] = ['1/16', 'octavos', 'cuartos', 'semis', '3er_puesto', 'final'];

export function ResultadosTab() {
  const { jugadorActivo } = useProdeStore();
  const [grupoActivo, setGrupoActivo] = useState<string>('A');
  const [faseActiva, setFaseActiva] = useState<Fase>('1/16');
  const [seccion, setSeccion] = useState<'grupos' | 'eliminacion'>('grupos');

  if (!jugadorActivo?.esAdmin) {
    return (
      <div style={{
        textAlign: 'center', padding: '60px 20px',
        color: 'var(--text-muted)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div style={{ fontSize: 18, fontFamily: 'Bebas Neue', letterSpacing: '0.05em' }}>
          Solo el admin puede cargar resultados
        </div>
      </div>
    );
  }

  const filtrados = seccion === 'grupos'
    ? PARTIDOS.filter(p => p.grupo === grupoActivo)
    : PARTIDOS.filter(p => p.fase === faseActiva);

  return (
    <div>
      <div style={{
        background: 'rgba(201,168,76,0.08)',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 10, padding: '12px 16px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>⚽</span>
        <span style={{ fontSize: 14, color: 'var(--gold)' }}>
          Ingresá los resultados reales para calcular los puntos automáticamente.
        </span>
      </div>

      {/* Sección grupos / eliminación */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['grupos', 'eliminacion'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSeccion(s)}
            style={{
              padding: '8px 18px', borderRadius: 8,
              border: '1px solid',
              borderColor: seccion === s ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
              background: seccion === s ? 'rgba(201,168,76,0.15)' : 'transparent',
              color: seccion === s ? 'var(--gold)' : 'var(--text-muted)',
              fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14,
              letterSpacing: '0.05em', cursor: 'pointer',
            }}
          >
            {s === 'grupos' ? 'FASE DE GRUPOS' : 'ELIMINACIÓN DIRECTA'}
          </button>
        ))}
      </div>

      {/* Filtros */}
      {seccion === 'grupos' ? (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 24 }}>
          {GRUPOS_LIST.map(g => (
            <button
              key={g}
              onClick={() => setGrupoActivo(g)}
              style={{
                padding: '6px 14px', borderRadius: 8,
                border: '1px solid',
                borderColor: grupoActivo === g ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                background: grupoActivo === g ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: grupoActivo === g ? 'var(--gold)' : 'var(--text-muted)',
                fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Grupo {g}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 24 }}>
          {FASES_ELIMINACION.map(f => (
            <button
              key={f}
              onClick={() => setFaseActiva(f)}
              style={{
                padding: '6px 14px', borderRadius: 8,
                border: '1px solid',
                borderColor: faseActiva === f ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                background: faseActiva === f ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: faseActiva === f ? 'var(--gold)' : 'var(--text-muted)',
                fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {FASES_LABEL[f]}
            </button>
          ))}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 10,
      }}>
        {filtrados.map(p => <PartidoCard key={p.id} partido={p} showResultInput />)}
      </div>
    </div>
  );
}