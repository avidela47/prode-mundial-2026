import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PARTIDOS, PUNTOS_FASE, estaBloquado, type Fase } from './fixture';

export interface Jugador {
  id: string;
  nombre: string;
  dni: string; // 4 últimos dígitos
  color: string;
  esAdmin: boolean;
}

export interface ProdeStore {
  // Estado
  jugadores: Jugador[];
  jugadorActivo: Jugador | null;
  predicciones: Record<string, Record<string, string>>; // { jugadorId: { partidoId: '1'|'X'|'2' } }
  resultados: Record<string, { gl: number; gv: number }>; // { partidoId: { gl, gv } }

  // Auth simple
  login: (nombre: string, dni: string) => boolean;
  logout: () => void;

  // Admin
  addJugador: (nombre: string, dni: string, esAdmin?: boolean) => void;
  removeJugador: (id: string) => void;

  // Predicciones
  setPredicion: (partidoId: string, valor: string) => void;

  // Resultados (solo admin)
  setResultado: (partidoId: string, gl: number, gv: number) => void;

  // Puntos
  getPuntosJugador: (jugadorId: string) => { puntos: number; aciertos: number; jugados: number };
  getRanking: () => Array<Jugador & { puntos: number; aciertos: number; jugados: number }>;
}

const COLORES = [
  '#C8102E','#003087','#00843D','#C9A84C',
  '#FF6B00','#8B0000','#1B5E20','#4A0080',
  '#005F73','#AE2012','#0077B6','#606C38',
];

function calcResultado(gl: number, gv: number): '1' | 'X' | '2' {
  if (gl > gv) return '1';
  if (gl === gv) return 'X';
  return '2';
}

function getFase(partidoId: string): Fase {
  const p = PARTIDOS.find(p => p.id === partidoId);
  return p?.fase ?? 'grupos';
}

export const useProdeStore = create<ProdeStore>()(
  persist(
    (set, get) => ({
      jugadores: [],
      jugadorActivo: null,
      predicciones: {},
      resultados: {},

      login: (nombre, dni) => {
        const { jugadores } = get();
        const jugador = jugadores.find(
          j => j.nombre.toLowerCase() === nombre.toLowerCase().trim() && j.dni === dni.trim()
        );
        if (!jugador) return false;
        set({ jugadorActivo: jugador });
        return true;
      },

      logout: () => set({ jugadorActivo: null }),

      addJugador: (nombre, dni, esAdmin = false) => {
        const { jugadores } = get();
        const id = `j_${Date.now()}`;
        const color = COLORES[jugadores.length % COLORES.length];
        set(state => ({
          jugadores: [...state.jugadores, { id, nombre: nombre.trim(), dni: dni.trim(), color, esAdmin }],
        }));
      },

      removeJugador: (id) => {
        set(state => ({
          jugadores: state.jugadores.filter(j => j.id !== id),
          jugadorActivo: state.jugadorActivo?.id === id ? null : state.jugadorActivo,
        }));
      },

      setPredicion: (partidoId, valor) => {
        const { jugadorActivo, predicciones } = get();
        if (!jugadorActivo) return;

        // Verificar bloqueo
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
      },

      setResultado: (partidoId, gl, gv) => {
        const { jugadorActivo } = get();
        if (!jugadorActivo?.esAdmin) return;
        set(state => ({
          resultados: {
            ...state.resultados,
            [partidoId]: { gl, gv },
          },
        }));
      },

      getPuntosJugador: (jugadorId) => {
        const { predicciones, resultados } = get();
        const preds = predicciones[jugadorId] || {};
        let puntos = 0, aciertos = 0, jugados = 0;

        for (const [partidoId, res] of Object.entries(resultados)) {
          const pred = preds[partidoId];
          if (!pred) continue;
          jugados++;
          const resReal = calcResultado(res.gl, res.gv);
          if (pred === resReal) {
            const fase = getFase(partidoId);
            puntos += PUNTOS_FASE[fase];
            aciertos++;
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
    }),
    { name: 'prode-mundial-2026-v2' }
  )
);