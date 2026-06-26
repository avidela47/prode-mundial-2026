'use client';

import { useState, useEffect } from 'react';
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
  const [showLogin, setShowLogin] = useState(false);
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');

  const { jugadorActivo, jugadores, login, logout, init } = useProdeStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void init(); }, []);

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

      {/* HEADER */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mundial.jpg" alt="Mundial 2026" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--blue)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em' }}>PRODE MUNDIAL</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.06em' }}>USA · CANADA · MEXICO 2026</div>
            </div>
          </div>

          {jugadorActivo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--blue-light)', border: '1px solid #C7D8FA', borderRadius: 20, padding: '5px 12px' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: jugadorActivo.color }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue-dark)' }}>{jugadorActivo.nombre}</span>
                {jugadorActivo.esAdmin && (
                  <span className="badge" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>Admin</span>
                )}
              </div>
              <button onClick={logout} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 12px', color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                Salir
              </button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '0 2px 6px rgba(26,115,232,0.3)' }}>
              Ingresar
            </button>
          )}
        </div>
      </header>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)', padding: '28px 16px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mundial.jpg" alt="Mundial 2026" style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', flexShrink: 0 }} />
          <div>
            <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 'clamp(26px,6vw,44px)', fontWeight: 700, lineHeight: 1, color: '#fff', marginBottom: 6, letterSpacing: '0.03em' }}>
              COPA MUNDIAL FIFA 2026
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 400 }}>
              48 selecciones · 104 partidos · 12 grupos · Final 19 Jul, Nueva York
            </p>
            <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
              {[['11 Jun','Inicio'],['48','Equipos'],['12','Grupos'],['104','Partidos']].map(([v,l],i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#FCD34D' }}>{v}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 56, zIndex: 90, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.id} className={`tab-item${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 80px' }}>
        {tab === 'fixture' && <FixtureTab />}
        {tab === 'resultados' && <ResultadosTab />}
        {tab === 'tabla' && <TablaTab />}
      </main>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div onClick={() => setShowLogin(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mundial.jpg" alt="" style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', margin: '0 auto 12px' }} />
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--blue)', letterSpacing: '0.05em' }}>INGRESAR AL PRODE</div>
            </div>

            {jugadores.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Seleccioná tu nombre
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {jugadores.map(j => (
                    <button key={j.id} onClick={() => setNombre(j.nombre)} style={{ padding: '6px 12px', borderRadius: 8, border: `1.5px solid ${nombre === j.nombre ? 'var(--blue)' : '#E5E7EB'}`, background: nombre === j.nombre ? 'var(--blue-light)' : '#fff', color: nombre === j.nombre ? 'var(--blue-dark)' : 'var(--text-muted)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                      {j.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre..." style={{ height: 44, background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '0 14px', color: 'var(--text)', fontSize: 15, fontFamily: 'Inter, sans-serif' }} />
              <input type="password" inputMode="numeric" value={dni} onChange={e => setDni(e.target.value.replace(/\D/g, '').slice(0, 4))} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="4 últimos dígitos del DNI" maxLength={4} style={{ height: 44, background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '0 14px', color: 'var(--text)', fontSize: 15, fontFamily: 'Inter, sans-serif' }} />
              {error && <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#991B1B', fontWeight: 500 }}>{error}</div>}
              <button onClick={handleLogin} style={{ height: 48, borderRadius: 10, border: 'none', background: 'var(--blue)', color: '#fff', fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer', boxShadow: '0 3px 10px rgba(26,115,232,0.3)' }}>
                ENTRAR
              </button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ borderTop: '1px solid var(--border)', padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, background: '#fff' }}>
        Prode Mundial 2026 · FIFA World Cup USA · Canada · Mexico
      </footer>
    </div>
  );
}