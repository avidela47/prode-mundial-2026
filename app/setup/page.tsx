'use client';

import { useState, useEffect } from 'react';

interface Jugador {
  id: string;
  nombre: string;
  color: string;
  esAdmin: boolean;
}

export default function Setup() {
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [esAdmin, setEsAdmin] = useState(false);
  const [msg, setMsg] = useState('');
  const [jugadores, setJugadores] = useState<Jugador[]>([]);

  async function cargarJugadores() {
    const res = await fetch('/api/usuarios');
    const data = await res.json();
    setJugadores(data);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
useEffect(() => { void cargarJugadores(); }, []);

  async function handleAdd() {
    if (!nombre.trim() || dni.length !== 4) {
      setMsg('❌ Nombre y 4 dígitos de DNI requeridos');
      return;
    }
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, dni, esAdmin }),
    });
    const data = await res.json();
    if (data.error) { setMsg(`❌ ${data.error}`); return; }
    setMsg(`✓ ${nombre} agregado`);
    setNombre('');
    setDni('');
    setEsAdmin(false);
    cargarJugadores();
  }

  async function handleDelete(id: string) {
    await fetch('/api/usuarios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    cargarJugadores();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A', padding: 32, color: '#F0F4FF', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#C9A84C', marginBottom: 8 }}>⚙️ Setup — Participantes</h1>
      <p style={{ color: '#8899BB', marginBottom: 24, fontSize: 13 }}>Esta página solo la usa el admin para cargar los jugadores.</p>

      <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre"
          style={{ height: 44, padding: '0 14px', borderRadius: 8, border: '1px solid #333', background: '#111827', color: '#fff', fontSize: 15 }}
        />
        <input
          value={dni}
          onChange={e => setDni(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="4 últimos dígitos DNI"
          maxLength={4}
          style={{ height: 44, padding: '0 14px', borderRadius: 8, border: '1px solid #333', background: '#111827', color: '#fff', fontSize: 15 }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
          <input type="checkbox" checked={esAdmin} onChange={e => setEsAdmin(e.target.checked)} />
          Es admin
        </label>
        <button
          onClick={handleAdd}
          style={{ height: 44, background: '#C9A84C', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
        >
          AGREGAR
        </button>
        {msg && <div style={{ color: msg.startsWith('❌') ? '#FF6B6B' : '#00D46A', fontWeight: 600 }}>{msg}</div>}
      </div>

      <div style={{ marginTop: 40, maxWidth: 400 }}>
        <h2 style={{ marginBottom: 12, color: '#8899BB', fontSize: 16 }}>Jugadores cargados ({jugadores.length})</h2>
        {jugadores.map(j => (
          <div key={j.id} style={{ padding: '10px 14px', background: '#111827', borderRadius: 8, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: j.color, flexShrink: 0 }} />
            <span style={{ fontWeight: 600, flex: 1 }}>{j.nombre}</span>
            {j.esAdmin && <span style={{ color: '#C9A84C', fontSize: 11, fontWeight: 700 }}>ADMIN</span>}
            <button onClick={() => handleDelete(j.id)} style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}