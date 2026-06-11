'use client';

import { useState } from 'react';
import { FlagImg } from './FlagImg';
import { useProdeStore } from '@/lib/store';
import { getEstadoApuesta, horaCierre, type Partido } from '@/lib/fixture';

interface Props {
  partido: Partido;
  showResultInput?: boolean;
  readOnly?: boolean;
}

export function PartidoCard({ partido, showResultInput = false, readOnly = false }: Props) {
  const { jugadorActivo, predicciones, resultados, setPredicion, setResultado, deleteResultado } = useProdeStore();

  const predRaw = jugadorActivo ? (predicciones[jugadorActivo.id]?.[partido.id] || '') : '';
  const [predGl, predGv] = predRaw.includes('-') ? predRaw.split('-').map(Number) : [null, null];
  const [localInput, setLocalInput] = useState(predGl !== null ? String(predGl) : '');
  const [visitaInput, setVisitaInput] = useState(predGv !== null ? String(predGv) : '');

  const resultado = resultados[partido.id];
  const estado = getEstadoApuesta(partido);
  const bloqueado = estado !== 'abierto';
  const puedeApostar = jugadorActivo && !showResultInput && !readOnly && (!bloqueado || jugadorActivo.esAdmin);

  function signo(gl: number | null, gv: number | null): '1' | 'X' | '2' | null {
    if (gl === null || gv === null) return null;
    if (gl > gv) return '1';
    if (gl === gv) return 'X';
    return '2';
  }

  const signoPred = signo(predGl, predGv);
  const signoReal = resultado ? signo(resultado.gl, resultado.gv) : null;
  const esExacto = resultado && predRaw === `${resultado.gl}-${resultado.gv}`;
  const esSigno = !esExacto && signoPred && signoReal && signoPred === signoReal;
  const esError = resultado && predRaw && predRaw.includes('-') && !esExacto && !esSigno;

  function handleScore(side: 'local' | 'visita', val: string) {
    const num = parseInt(val);
    if (isNaN(num) || num < 0) return;
    const gl = side === 'local' ? num : (resultado?.gl ?? 0);
    const gv = side === 'visita' ? num : (resultado?.gv ?? 0);
    setResultado(partido.id, gl, gv);
  }

  return (
    <div className="card fade-up" style={{
      padding: '12px 14px',
      borderColor: esExacto ? 'rgba(201,168,76,0.5)' : esSigno ? 'rgba(0,154,85,0.4)' : esError ? 'rgba(200,16,46,0.3)' : undefined,
    }}>
      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {partido.grupo && <span className="group-pill">{partido.grupo}</span>}
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontWeight: 600 }}>
            {partido.fecha} · {partido.hora}hs
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {bloqueado && !resultado && !readOnly && (
            <span style={{ fontSize: 10, color: '#FF6B00', fontFamily: 'Barlow Condensed', fontWeight: 700 }}>
              🔒 Cierra {horaCierre(partido)}hs
            </span>
          )}
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{partido.sede}</span>
        </div>
      </div>

      {/* Equipos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

        {/* Local */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <FlagImg equipo={partido.local} size={28} />
          <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {partido.local}
          </span>
        </div>

        {/* Centro */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>

          {/* Admin: inputs para cargar resultado */}
          {showResultInput && jugadorActivo?.esAdmin ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input className="score-input" type="number" min={0} max={20}
                  value={resultado?.gl ?? ''} placeholder="0"
                  onChange={e => handleScore('local', e.target.value)} />
                <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>:</span>
                <input className="score-input" type="number" min={0} max={20}
                  value={resultado?.gv ?? ''} placeholder="0"
                  onChange={e => handleScore('visita', e.target.value)} />
              </div>
              {resultado && (
                <button onClick={() => deleteResultado(partido.id)}
                  style={{ fontSize: 10, color: '#FF4D6D', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Barlow Condensed', fontWeight: 700 }}>
                  ✕ Borrar resultado
                </button>
              )}
            </div>
          ) : resultado ? (
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Bebas Neue', letterSpacing: 2, padding: '0 4px' }}>
              {resultado.gl} - {resultado.gv}
            </div>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, padding: '0 4px' }}>VS</span>
          )}

          {/* Inputs predicción — solo fixture, no readOnly */}
          {!showResultInput && !readOnly && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input className="score-input" type="number" min={0} max={20}
                value={localInput} placeholder="0" disabled={!puedeApostar}
                onChange={e => setLocalInput(e.target.value)}
                onBlur={async () => {
                  const gl = parseInt(localInput);
                  const gv = parseInt(visitaInput);
                  if (!isNaN(gl) && !isNaN(gv) && gl >= 0 && gv >= 0) await setPredicion(partido.id, `${gl}-${gv}`);
                }}
                style={{ opacity: !puedeApostar ? 0.4 : 1, cursor: !puedeApostar ? 'not-allowed' : 'text', fontSize: 18 }}
              />
              <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: 14 }}>-</span>
              <input className="score-input" type="number" min={0} max={20}
                value={visitaInput} placeholder="0" disabled={!puedeApostar}
                onChange={e => setVisitaInput(e.target.value)}
                onBlur={async () => {
                  const gl = parseInt(localInput);
                  const gv = parseInt(visitaInput);
                  if (!isNaN(gl) && !isNaN(gv) && gl >= 0 && gv >= 0) await setPredicion(partido.id, `${gl}-${gv}`);
                }}
                style={{ opacity: !puedeApostar ? 0.4 : 1, cursor: !puedeApostar ? 'not-allowed' : 'text', fontSize: 18 }}
              />
            </div>
          )}

          {/* Apuesta guardada */}
          {!showResultInput && predRaw && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontWeight: 600 }}>
              Tu apuesta: {predRaw}
            </span>
          )}
        </div>

        {/* Visita */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row-reverse', minWidth: 0 }}>
          <FlagImg equipo={partido.visita} size={28} />
          <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {partido.visita}
          </span>
        </div>
      </div>

      {/* Badge */}
      {(esExacto || esSigno || esError) && (
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
          <span className="badge" style={{
            background: esExacto ? 'rgba(201,168,76,0.2)' : esSigno ? 'rgba(0,107,60,0.3)' : 'rgba(200,16,46,0.2)',
            color: esExacto ? 'var(--gold)' : esSigno ? '#00D46A' : '#FF4D6D',
            border: `1px solid ${esExacto ? 'rgba(201,168,76,0.4)' : esSigno ? 'rgba(0,212,106,0.3)' : 'rgba(255,77,109,0.3)'}`,
          }}>
            {esExacto ? '★ Exacto +5pts' : esSigno ? '✓ Signo +3pts' : '✗ Error'}
          </span>
        </div>
      )}
    </div>
  );
}