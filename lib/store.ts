import { create } from 'zustand';
import { PARTIDOS, PUNTOS_SIGNO, PUNTOS_EXACTO, estaBloquado, type Fase } from './fixture';

export interface Jugador {
  id: string;
  nombre: string;
  dni: string;
  color: string;
  esAdmin: boolean;
}

export interface ProdeStore {
  jugadores: Jugador[];
  jugadorActivo: Jugador | null;
  predicciones: Record<string, Record<string, string>>;
  resultados: Record<string, { gl: number; gv: number }>;
  loading: boolean;
  init: () => Promise<void>;
  login: (nombre: string, dni: string) => boolean;
  logout: () => void;
  setPredicion: (partidoId: string, valor: string) => Promise<void>;
  setResultado: (partidoId: string, gl: number, gv: number) => Promise<void>;
  deleteResultado: (partidoId: string) => Promise<void>;
  getPuntosJugador: (jugadorId: string) => { puntos: number; aciertos: number; jugados: number };
  getRanking: () => Array<Jugador & { puntos: number; aciertos: number; jugados: number }>;
}

function calcSigno(gl: number, gv: number): '1' | 'X' | '2' {
  if (gl > gv) return '1';
  if (gl === gv) return 'X';
  return '2';
}

function getFase(partidoId: string): Fase {
  const p = PARTIDOS.find(p => p.id === partidoId);
  return p?.fase ?? 'grupos';
}

export const useProdeStore = create<ProdeStore>((set, get) => ({
  jugadores: [],
  jugadorActivo: null,
  predicciones: {},
  resultados: {},
  loading: false,

  init: async () => {
    set({ loading: true });
    try {
      const jugRes = await fetch('/api/usuarios');
      const jugadores: Jugador[] = await jugRes.json();

      const resRes = await fetch('/api/resultados');
      const resultadosArr: { partidoId: string; gl: number; gv: number }[] = await resRes.json();
      const resultados: Record<string, { gl: number; gv: number }> = {};
      resultadosArr.forEach(r => { resultados[r.partidoId] = { gl: r.gl, gv: r.gv }; });

      const predRes = await fetch('/api/predicciones');
      const predsArr: { jugadorId: string; partidoId: string; valor: string }[] = await predRes.json();
      const predicciones: Record<string, Record<string, string>> = {};
      predsArr.forEach(p => {
        if (!predicciones[p.jugadorId]) predicciones[p.jugadorId] = {};
        predicciones[p.jugadorId][p.partidoId] = p.valor;
      });

      const savedId = sessionStorage.getItem('jugadorActivoId');
      const jugadorActivo = savedId ? jugadores.find(j => j.id === savedId) || null : null;

      set({ jugadores, resultados, predicciones, jugadorActivo, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  login: (nombre, dni) => {
    const { jugadores } = get();
    const jugador = jugadores.find(
      j => j.nombre.toLowerCase() === nombre.toLowerCase().trim() && j.dni === dni.trim()
    );
    if (!jugador) return false;
    sessionStorage.setItem('jugadorActivoId', jugador.id);
    set({ jugadorActivo: jugador });
    return true;
  },

  logout: () => {
    sessionStorage.removeItem('jugadorActivoId');
    set({ jugadorActivo: null });
  },

  setPredicion: async (partidoId, valor) => {
    const { jugadorActivo, predicciones } = get();
    if (!jugadorActivo) return;
    const partido = PARTIDOS.find(p => p.id === partidoId);
    if (!partido) return;
    if (estaBloquado(partido) && !jugadorActivo.esAdmin) return;

    const actual = predicciones[jugadorActivo.id]?.[partidoId];
    const nuevo = actual === valor ? '' : valor;

    set(state => ({
      predicciones: {
        ...state.predicciones,
        [jugadorActivo.id]: {
          ...(state.predicciones[jugadorActivo.id] || {}),
          [partidoId]: nuevo,
        },
      },
    }));

    await fetch('/api/predicciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jugadorId: jugadorActivo.id, partidoId, valor: nuevo }),
    });
  },

  setResultado: async (partidoId, gl, gv) => {
    const { jugadorActivo } = get();
    if (!jugadorActivo?.esAdmin) return;
    set(state => ({ resultados: { ...state.resultados, [partidoId]: { gl, gv } } }));
    await fetch('/api/resultados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partidoId, gl, gv }),
    });
  },

  deleteResultado: async (partidoId) => {
    const { jugadorActivo } = get();
    if (!jugadorActivo?.esAdmin) return;
    set(state => {
      const r = { ...state.resultados };
      delete r[partidoId];
      return { resultados: r };
    });
    await fetch('/api/resultados', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partidoId }),
    });
  },

  getPuntosJugador: (jugadorId) => {
    const { predicciones, resultados } = get();
    const preds = predicciones[jugadorId] || {};
    let puntos = 0, aciertos = 0, jugados = 0;

    for (const [partidoId, res] of Object.entries(resultados)) {
      const pred = preds[partidoId];
      if (!pred) continue;
      jugados++;
      const fase = getFase(partidoId);

      if (pred.includes('-')) {
        const [pGl, pGv] = pred.split('-').map(Number);
        if (pGl === res.gl && pGv === res.gv) {
          puntos += PUNTOS_EXACTO[fase];
          aciertos++;
        } else if (calcSigno(pGl, pGv) === calcSigno(res.gl, res.gv)) {
          puntos += PUNTOS_SIGNO[fase];
          aciertos++;
        }
      } else {
        if (pred === calcSigno(res.gl, res.gv)) {
          puntos += PUNTOS_SIGNO[fase];
          aciertos++;
        }
      }
    }
    return { puntos, aciertos, jugados };
  },

  getRanking: () => {
    const { jugadores, getPuntosJugador } = get();
    return jugadores
      .map(j => ({ ...j, ...getPuntosJugador(j.id) }))
      .sort((a, b) => b.puntos - a.puntos || b.aciertos - a.aciertos);
  },
}));