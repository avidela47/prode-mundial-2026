'use client';

import { useState } from 'react';
import { useProdeStore } from '@/lib/store';

export default function Setup() {
  const { addJugador, jugadores } = useProdeStore();
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [esAdmin, setEsAdmin] = useState(false);
  const [msg, setMsg] = useState('');

  function handleAdd() {
    if (!nombre.trim() || dni.length !== 4) {
      setMsg('Nombre y 4 dígitos de DNI requeridos');
      return;
    }
    addJugador(nombre, dni, esAdmin);
    setMsg(`✓ ${nombre} agregado`);
    setNombre('');
    setDni('');
    setEsAdmin(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A', padding: 32, color: '#F0F4FF', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#C9A84C', marginBottom: 24 }}>⚙️ Setup — Agregar participantes</h1>

      <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 12 }}>
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
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={esAdmin} onChange={e => setEsAdmin(e.target.checked)} />
          Es admin
        </label>
        <button
          onClick={handleAdd}
          style={{ height: 44, background: '#C9A84C', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
        >
          AGREGAR
        </button>
        {msg && <div style={{ color: '#00D46A', fontWeight: 600 }}>{msg}</div>}
      </div>

      <div style={{ marginTop: 40 }}>
        <h2 style={{ marginBottom: 16, color: '#8899BB' }}>Participantes cargados ({jugadores.length})</h2>
        {jugadores.map(j => (
          <div key={j.id} style={{ padding: '8px 14px', background: '#111827', borderRadius: 8, marginBottom: 6, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: j.color }} />
            <span style={{ fontWeight: 600 }}>{j.nombre}</span>
            {j.esAdmin && <span style={{ color: '#C9A84C', fontSize: 12 }}>ADMIN</span>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, color: '#8899BB', fontSize: 13 }}>
        Una vez cargados todos, esta página no la uses más.<br/>
        URL: <strong>/setup</strong>
      </div>
    </div>
  );
}