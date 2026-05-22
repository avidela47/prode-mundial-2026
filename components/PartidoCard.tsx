'use client';

import { FlagImg } from './FlagImg';
import { useProdeStore } from '@/lib/store';
import { estaBloquado, type Partido } from '@/lib/fixture';

interface Props {
  partido: Partido;
  showResultInput?: boolean;
}

export function PartidoCard({ partido, showResultInput = false }: Props) {
  const { jugadorActivo, predicciones, resultados, setPredicion, setResultado } = useProdeStore();

  const pred = jugadorActivo ? (predicciones[jugadorActivo.id]?.[partido.id] || '') : '';
  const resultado = resultados[partido.id];
  const bloqueado = estaBloquado(partido);

  let resReal: '1' | 'X' | '2' | null = null;
  if (resultado) {
    if (resultado.gl > resultado.gv) resReal = '1';
    else if (resultado.gl === resultado.gv) resReal = 'X';
    else resReal = '2';
  }

  const isCorrect = pred && resReal && pred === resReal;
  const isWrong = pred && resReal && pred !== resReal;
  const puedeApostar = jugadorActivo && !showResultInput && (!bloqueado || jugadorActivo.esAdmin);

  function handleScore(side: 'local' | 'visita', val: string) {
    const num = parseInt(val);
    if (isNaN(num) || num < 0) return;
    const gl = side === 'local' ? num : (resultado?.gl ?? 0);
    const gv = side === 'visita' ? num : (resultado?.gv ?? 0);
    setResultado(partido.id, gl, gv);
  }

  return (
    <div
      className="card fade-up"
      style={{
        padding: '12px 14px',
        borderColor: isCorrect ? 'rgba(0,154,85,0.4)' : isWrong ? 'rgba(200,16,46,0.3)' : undefined,
      }}
    >
      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {partido.grupo && <span className="group-pill">{partido.grupo}</span>}
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontWeight: 600 }}>
            {partido.fecha} · {partido.hora}hs
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {bloqueado && !resReal && (
            <span style={{ fontSize: 10, color: '#FF6B00', fontFamily: 'Barlow Condensed', fontWeight: 700 }}>🔒</span>
          )}
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{partido.sede}</span>
        </div>
      </div>

      {/* Equipos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

        {/* Local */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <FlagImg equipo={partido.local} size={28} />
          <span style={{
            fontSize: 12, fontWeight: 700, lineHeight: 1.2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {partido.local}
          </span>
        </div>

        {/* Centro */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {showResultInput && jugadorActivo?.esAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input className="score-input" type="number" min={0} max={20}
                defaultValue={resultado?.gl ?? ''} placeholder="0"
                onChange={e => handleScore('local', e.target.value)}
              />
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>:</span>
              <input className="score-input" type="number" min={0} max={20}
                defaultValue={resultado?.gv ?? ''} placeholder="0"
                onChange={e => handleScore('visita', e.target.value)}
              />
            </div>
          ) : resultado ? (
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Bebas Neue', letterSpacing: 2, padding: '0 4px' }}>
              {resultado.gl} - {resultado.gv}
            </div>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, padding: '0 4px' }}>VS</span>
          )}

          {/* Botones 1 X 2 */}
          {!showResultInput && (
            <div style={{ display: 'flex', gap: 4 }}>
              {(['1', 'X', '2'] as const)
  .filter(v => partido.fase === 'grupos' || v !== 'X')
  .map(v => (
    <button
      key={v}
      className={`pred-btn${pred === v ? ` active-${v.toLowerCase()}` : ''}`}
      onClick={() => puedeApostar && setPredicion(partido.id, v)}
      disabled={!puedeApostar}
      style={{ opacity: !puedeApostar ? 0.4 : 1, cursor: !puedeApostar ? 'not-allowed' : 'pointer' }}
    >
      {v}
    </button>
 ))}
            </div>
          )}
        </div>

        {/* Visita */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row-reverse', minWidth: 0 }}>
          <FlagImg equipo={partido.visita} size={28} />
          <span style={{
            fontSize: 12, fontWeight: 700, lineHeight: 1.2, textAlign: 'right',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {partido.visita}
          </span>
        </div>
      </div>

      {/* Badge */}
      {(isCorrect || isWrong) && (
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
          <span className="badge" style={{
            background: isCorrect ? 'rgba(0,107,60,0.3)' : 'rgba(200,16,46,0.2)',
            color: isCorrect ? '#00D46A' : '#FF4D6D',
            border: `1px solid ${isCorrect ? 'rgba(0,212,106,0.3)' : 'rgba(255,77,109,0.3)'}`,
          }}>
            {isCorrect ? '✓ Acertaste' : '✗ Error'}
          </span>
        </div>
      )}
    </div>
  );
}