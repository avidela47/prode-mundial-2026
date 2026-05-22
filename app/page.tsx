'use client';

import { useState } from 'react';
import { FixtureTab } from '@/components/FixtureTab';
import { ResultadosTab } from '@/components/ResultadosTab';
import { TablaTab } from '@/components/TablaTab';
import { useProdeStore } from '@/lib/store';

const TABS = [
  { id: 'fixture', label: '⚽ Fixture' },
  { id: 'resultados', label: '📋 Resultados' },
  { id: 'tabla', label: '🏆 Tabla' },
];

export default function Home() {
  const [tab, setTab] = useState('fixture');
  const { jugadorActivo, jugadores, login, logout } = useProdeStore();
  const [showLogin, setShowLogin] = useState(false);
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');
 
  function handleLogin() {
    setError('');
    const ok = login(nombre, dni);
    if (!ok) { setError('Nombre o DNI incorrecto'); return; }
    setShowLogin(false);
    setNombre('');
    setDni('');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── HEADER ── */}
      <header style={{
        background: 'rgba(10,14,26,0.95)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '0 16px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/logo-mundial.jpg"
              alt="Mundial 2026"
              style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }}
            />
            <div>
              <div className="font-display" style={{ fontSize: 18, lineHeight: 1, color: 'var(--gold)' }}>
                PRODE MUNDIAL
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontWeight: 600, letterSpacing: '0.08em' }}>
                USA · CANADA · MEXICO 2026
              </div>
            </div>
          </div>

          {/* Login / usuario */}
          {jugadorActivo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: '5px 12px',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: jugadorActivo.color }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{jugadorActivo.nombre}</span>
                {jugadorActivo.esAdmin && (
                  <span className="badge" style={{ background: 'rgba(201,168,76,0.2)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '5px 10px',
                  color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
                }}
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              style={{
                background: 'var(--gold)', color: '#000',
                border: 'none', borderRadius: 8,
                padding: '8px 16px',
                fontFamily: 'Barlow Condensed', fontWeight: 700,
                fontSize: 14, letterSpacing: '0.05em', cursor: 'pointer',
              }}
            >
              INGRESAR
            </button>
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,39,90,0.8) 0%, rgba(0,107,60,0.5) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '24px 16px 20px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <img
            src="/logo-mundial.jpg"
            alt="Mundial 2026"
            style={{
              width: 80, height: 80,
              borderRadius: 16, objectFit: 'cover',
              boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
              flexShrink: 0,
            }}
          />
          <div>
            <h1 className="font-display" style={{ fontSize: 'clamp(28px, 6vw, 48px)', lineHeight: 1, marginBottom: 6 }}>
              COPA MUNDIAL FIFA 2026
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              48 selecciones · 104 partidos · 12 grupos · Final 19 Jul, Nueva York
            </p>
            <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
              {[['11 Jun','Inicio'],['48','Equipos'],['12','Grupos'],['104','Partidos']].map(([v,l],i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span className="font-display" style={{ fontSize: 20, color: 'var(--gold)' }}>{v}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 56, zIndex: 90,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.id} className={`tab-item${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 80px' }}>
        {tab === 'fixture' && <FixtureTab />}
        {tab === 'resultados' && <ResultadosTab />}
        {tab === 'tabla' && <TablaTab />}
      </main>

      {/* ── LOGIN MODAL ── */}
      {showLogin && (
        <div
          onClick={() => setShowLogin(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 20, padding: '32px 28px',
              width: '100%', maxWidth: 380,
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <img src="/logo-mundial.jpg" alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', margin: '0 auto 12px' }} />
              <div className="font-display" style={{ fontSize: 24, color: 'var(--gold)' }}>INGRESAR AL PRODE</div>
            </div>

            {/* Lista participantes */}
            {jugadores.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Seleccioná tu nombre
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {jugadores.map(j => (
                    <button
                      key={j.id}
                      onClick={() => setNombre(j.nombre)}
                      style={{
                        padding: '6px 12px', borderRadius: 8,
                        border: `1px solid ${nombre === j.nombre ? j.color : 'rgba(255,255,255,0.1)'}`,
                        background: nombre === j.nombre ? `${j.color}22` : 'transparent',
                        color: nombre === j.nombre ? j.color : 'var(--text-muted)',
                        fontWeight: 600, fontSize: 13, cursor: 'pointer',
                      }}
                    >
                      {j.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre..."
                style={{
                  height: 44, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10, padding: '0 14px',
                  color: 'var(--text)', fontSize: 15,
                }}
              />
              <input
                type="password"
                inputMode="numeric"
                value={dni}
                onChange={e => setDni(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="4 últimos dígitos del DNI"
                maxLength={4}
                style={{
                  height: 44, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10, padding: '0 14px',
                  color: 'var(--text)', fontSize: 15,
                }}
              />
              {error && (
                <div style={{ background: 'rgba(200,16,46,0.15)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#FF6B6B' }}>
                  {error}
                </div>
              )}
              <button
                onClick={handleLogin}
                style={{
                  height: 48, borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)',
                  color: '#000', fontFamily: 'Bebas Neue',
                  fontSize: 18, letterSpacing: '0.08em', cursor: 'pointer',
                }}
              >
                ENTRAR
              </button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ borderTop: '1px solid var(--border)', padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
        Prode Mundial 2026 · FIFA World Cup USA · Canada · Mexico
      </footer>
    </div>
  );
}