export type Resultado = '1' | 'X' | '2' | null;
export type Fase = 'grupos' | '1/16' | 'octavos' | 'cuartos' | 'semis' | '3er_puesto' | 'final';

export interface Partido {
  id: string;
  fase: Fase;
  grupo?: string;
  fechaISO: string; // UTC — para calcular bloqueo
  fecha: string;    // display
  hora: string;     // display hora Argentina
  sede: string;
  local: string;
  visita: string;
}

export interface Equipo {
  nombre: string;
  codigo: string;
  grupo?: string;
}

// Puntos por fase
export const PUNTOS_SIGNO: Record<Fase, number> = {
  'grupos':      3,
  '1/16':        5,
  'octavos':     5,
  'cuartos':     8,
  'semis':       8,
  '3er_puesto': 10,
  'final':      10,
};

export const PUNTOS_EXACTO: Record<Fase, number> = {
  'grupos':      5,
  '1/16':        8,
  'octavos':     8,
  'cuartos':     12,
  'semis':       12,
  '3er_puesto': 15,
  'final':      15,
};

// Retorna el estado del partido para apuestas
export type EstadoApuesta = 'muy_temprano' | 'abierto' | 'cerrado';

export function getEstadoApuesta(partido: Partido): EstadoApuesta {
  const ahora = new Date();
  const inicio = new Date(partido.fechaISO);
  const dos = new Date(inicio.getTime() - 2 * 60 * 60 * 1000);

  // Primer partido del mundial: 11 Jun 19:00 UTC (16:00 ARG)
  const primerPartido = new Date('2026-06-11T19:00:00Z');
  const cierreFaseGrupos = new Date(primerPartido.getTime() - 2 * 60 * 60 * 1000);

  // Fin fase de grupos: último partido 27 Jun
  const finGrupos = new Date('2026-06-28T23:00:00Z');

  if (partido.fase === 'grupos') {
    if (ahora < cierreFaseGrupos) return 'abierto';
    if (ahora >= cierreFaseGrupos && ahora < dos) return 'cerrado';
    return 'cerrado';
  }

  // Fases eliminatorias: bloqueado hasta que terminen los grupos
  if (ahora < finGrupos) return 'muy_temprano';
  if (ahora < dos) return 'abierto';
  return 'cerrado';
}

// Para compatibilidad con el código existente
export function estaBloquado(partido: Partido): boolean {
  const estado = getEstadoApuesta(partido);
  return estado !== 'abierto';
}

// Hora Argentina formateada
export function horaApertura(partido: Partido): string {
  const inicio = new Date(partido.fechaISO);
  const apertura = new Date(inicio.getTime() - 6 * 60 * 60 * 1000);
  return apertura.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires' });
}

export const EQUIPOS: Record<string, Equipo> = {
  'México':          { nombre: 'México',          codigo: 'mx', grupo: 'A' },
  'Sudáfrica':       { nombre: 'Sudáfrica',        codigo: 'za', grupo: 'A' },
  'Corea del Sur':   { nombre: 'Corea del Sur',    codigo: 'kr', grupo: 'A' },
  'Rep. Checa':      { nombre: 'Rep. Checa',       codigo: 'cz', grupo: 'A' },
  'Canadá':          { nombre: 'Canadá',           codigo: 'ca', grupo: 'B' },
  'Bosnia':          { nombre: 'Bosnia',           codigo: 'ba', grupo: 'B' },
  'Qatar':           { nombre: 'Qatar',            codigo: 'qa', grupo: 'B' },
  'Suiza':           { nombre: 'Suiza',            codigo: 'ch', grupo: 'B' },
  'Brasil':          { nombre: 'Brasil',           codigo: 'br', grupo: 'C' },
  'Marruecos':       { nombre: 'Marruecos',        codigo: 'ma', grupo: 'C' },
  'Haití':           { nombre: 'Haití',            codigo: 'ht', grupo: 'C' },
  'Escocia':         { nombre: 'Escocia',          codigo: 'gb-sct', grupo: 'C' },
  'Alemania':        { nombre: 'Alemania',         codigo: 'de', grupo: 'D' },
  'Curazao':         { nombre: 'Curazao',          codigo: 'cw', grupo: 'D' },
  'Países Bajos':    { nombre: 'Países Bajos',     codigo: 'nl', grupo: 'D' },
  'Japón':           { nombre: 'Japón',            codigo: 'jp', grupo: 'D' },
  'Costa de Marfil': { nombre: 'Costa de Marfil',  codigo: 'ci', grupo: 'E' },
  'Ecuador':         { nombre: 'Ecuador',          codigo: 'ec', grupo: 'E' },
  'Suecia':          { nombre: 'Suecia',           codigo: 'se', grupo: 'E' },
  'Túnez':           { nombre: 'Túnez',            codigo: 'tn', grupo: 'E' },
  'España':          { nombre: 'España',           codigo: 'es', grupo: 'F' },
  'Cabo Verde':      { nombre: 'Cabo Verde',       codigo: 'cv', grupo: 'F' },
  'Bélgica':         { nombre: 'Bélgica',          codigo: 'be', grupo: 'F' },
  'Egipto':          { nombre: 'Egipto',           codigo: 'eg', grupo: 'F' },
  'Arabia Saudita':  { nombre: 'Arabia Saudita',   codigo: 'sa', grupo: 'G' },
  'Uruguay':         { nombre: 'Uruguay',          codigo: 'uy', grupo: 'G' },
  'Irán':            { nombre: 'Irán',             codigo: 'ir', grupo: 'G' },
  'Nueva Zelanda':   { nombre: 'Nueva Zelanda',    codigo: 'nz', grupo: 'G' },
  'Francia':         { nombre: 'Francia',          codigo: 'fr', grupo: 'H' },
  'Senegal':         { nombre: 'Senegal',          codigo: 'sn', grupo: 'H' },
  'Irak':            { nombre: 'Irak',             codigo: 'iq', grupo: 'H' },
  'Noruega':         { nombre: 'Noruega',          codigo: 'no', grupo: 'H' },
  'Australia':       { nombre: 'Australia',        codigo: 'au', grupo: 'I' },
  'Turquía':         { nombre: 'Turquía',          codigo: 'tr', grupo: 'I' },
  'Estados Unidos':  { nombre: 'Estados Unidos',   codigo: 'us', grupo: 'I' },
  'Paraguay':        { nombre: 'Paraguay',         codigo: 'py', grupo: 'I' },
  'Argentina':       { nombre: 'Argentina',        codigo: 'ar', grupo: 'J' },
  'Argelia':         { nombre: 'Argelia',          codigo: 'dz', grupo: 'J' },
  'Austria':         { nombre: 'Austria',          codigo: 'at', grupo: 'J' },
  'Jordania':        { nombre: 'Jordania',         codigo: 'jo', grupo: 'J' },
  'Portugal':        { nombre: 'Portugal',         codigo: 'pt', grupo: 'K' },
  'Colombia':        { nombre: 'Colombia',         codigo: 'co', grupo: 'K' },
  'Uzbekistán':      { nombre: 'Uzbekistán',       codigo: 'uz', grupo: 'K' },
  'RD del Congo':    { nombre: 'RD del Congo',     codigo: 'cd', grupo: 'K' },
  'Inglaterra':      { nombre: 'Inglaterra',       codigo: 'gb-eng', grupo: 'L' },
  'Croacia':         { nombre: 'Croacia',          codigo: 'hr', grupo: 'L' },
  'Ghana':           { nombre: 'Ghana',            codigo: 'gh', grupo: 'L' },
  'Panamá':          { nombre: 'Panamá',           codigo: 'pa', grupo: 'L' },
};

// fechaISO en UTC — hora Argentina es UTC-3
// Ejemplo: partido a las 16:00 Argentina = 19:00 UTC
export const PARTIDOS: Partido[] = [
  // ── GRUPO A ──
  { id:'A1', fase:'grupos', grupo:'A', fechaISO:'2026-06-11T19:00:00Z', fecha:'11 Jun', hora:'16:00', sede:'Ciudad de México', local:'México', visita:'Sudáfrica' },
  { id:'A2', fase:'grupos', grupo:'A', fechaISO:'2026-06-12T02:00:00Z', fecha:'11 Jun', hora:'23:00', sede:'Guadalajara', local:'Corea del Sur', visita:'Rep. Checa' },
  { id:'A3', fase:'grupos', grupo:'A', fechaISO:'2026-06-18T16:00:00Z', fecha:'18 Jun', hora:'13:00', sede:'Guadalajara', local:'Rep. Checa', visita:'Sudáfrica' },
  { id:'A4', fase:'grupos', grupo:'A', fechaISO:'2026-06-19T01:00:00Z', fecha:'18 Jun', hora:'22:00', sede:'Ciudad de México', local:'México', visita:'Corea del Sur' },
  { id:'A5', fase:'grupos', grupo:'A', fechaISO:'2026-06-25T23:00:00Z', fecha:'25 Jun', hora:'20:00', sede:'Guadalajara', local:'México', visita:'Rep. Checa' },
  { id:'A6', fase:'grupos', grupo:'A', fechaISO:'2026-06-25T23:00:00Z', fecha:'25 Jun', hora:'20:00', sede:'Ciudad de México', local:'Sudáfrica', visita:'Corea del Sur' },
  // ── GRUPO B ──
  { id:'B1', fase:'grupos', grupo:'B', fechaISO:'2026-06-12T19:00:00Z', fecha:'12 Jun', hora:'16:00', sede:'Toronto', local:'Canadá', visita:'Bosnia' },
  { id:'B2', fase:'grupos', grupo:'B', fechaISO:'2026-06-13T01:00:00Z', fecha:'12 Jun', hora:'22:00', sede:'San Francisco', local:'Qatar', visita:'Suiza' },
  { id:'B3', fase:'grupos', grupo:'B', fechaISO:'2026-06-18T19:00:00Z', fecha:'18 Jun', hora:'16:00', sede:'San Francisco', local:'Suiza', visita:'Bosnia' },
  { id:'B4', fase:'grupos', grupo:'B', fechaISO:'2026-06-18T22:00:00Z', fecha:'18 Jun', hora:'19:00', sede:'Toronto', local:'Canadá', visita:'Qatar' },
  { id:'B5', fase:'grupos', grupo:'B', fechaISO:'2026-06-24T19:00:00Z', fecha:'24 Jun', hora:'16:00', sede:'San Francisco', local:'Suiza', visita:'Canadá' },
  { id:'B6', fase:'grupos', grupo:'B', fechaISO:'2026-06-24T19:00:00Z', fecha:'24 Jun', hora:'16:00', sede:'Kansas City', local:'Bosnia', visita:'Qatar' },
  // ── GRUPO C ──
  { id:'C1', fase:'grupos', grupo:'C', fechaISO:'2026-06-13T22:00:00Z', fecha:'13 Jun', hora:'19:00', sede:'Nueva Jersey', local:'Brasil', visita:'Marruecos' },
  { id:'C2', fase:'grupos', grupo:'C', fechaISO:'2026-06-14T01:00:00Z', fecha:'13 Jun', hora:'22:00', sede:'Atlanta', local:'Haití', visita:'Escocia' },
  { id:'C3', fase:'grupos', grupo:'C', fechaISO:'2026-06-19T22:00:00Z', fecha:'19 Jun', hora:'19:00', sede:'Atlanta', local:'Escocia', visita:'Marruecos' },
  { id:'C4', fase:'grupos', grupo:'C', fechaISO:'2026-06-20T01:00:00Z', fecha:'19 Jun', hora:'22:00', sede:'Nueva Jersey', local:'Brasil', visita:'Haití' },
  { id:'C5', fase:'grupos', grupo:'C', fechaISO:'2026-06-25T23:00:00Z', fecha:'25 Jun', hora:'20:00', sede:'Nueva Jersey', local:'Brasil', visita:'Escocia' },
  { id:'C6', fase:'grupos', grupo:'C', fechaISO:'2026-06-25T23:00:00Z', fecha:'25 Jun', hora:'20:00', sede:'Atlanta', local:'Marruecos', visita:'Haití' },
  // ── GRUPO D ──
  { id:'D1', fase:'grupos', grupo:'D', fechaISO:'2026-06-14T17:00:00Z', fecha:'14 Jun', hora:'14:00', sede:'Los Ángeles', local:'Alemania', visita:'Curazao' },
  { id:'D2', fase:'grupos', grupo:'D', fechaISO:'2026-06-14T20:00:00Z', fecha:'14 Jun', hora:'17:00', sede:'Dallas', local:'Países Bajos', visita:'Japón' },
  { id:'D3', fase:'grupos', grupo:'D', fechaISO:'2026-06-20T20:00:00Z', fecha:'20 Jun', hora:'17:00', sede:'Los Ángeles', local:'Alemania', visita:'Costa de Marfil' },
  { id:'D4', fase:'grupos', grupo:'D', fechaISO:'2026-06-20T17:00:00Z', fecha:'20 Jun', hora:'14:00', sede:'Dallas', local:'Países Bajos', visita:'Suecia' },
  { id:'D5', fase:'grupos', grupo:'D', fechaISO:'2026-06-27T23:00:00Z', fecha:'27 Jun', hora:'20:00', sede:'Dallas', local:'Alemania', visita:'Países Bajos' },
  { id:'D6', fase:'grupos', grupo:'D', fechaISO:'2026-06-27T23:00:00Z', fecha:'27 Jun', hora:'20:00', sede:'Los Ángeles', local:'Curazao', visita:'Japón' },
  // ── GRUPO E ──
  { id:'E1', fase:'grupos', grupo:'E', fechaISO:'2026-06-14T23:00:00Z', fecha:'14 Jun', hora:'20:00', sede:'Boston', local:'Costa de Marfil', visita:'Ecuador' },
  { id:'E2', fase:'grupos', grupo:'E', fechaISO:'2026-06-15T02:00:00Z', fecha:'14 Jun', hora:'23:00', sede:'Miami', local:'Suecia', visita:'Túnez' },
  { id:'E3', fase:'grupos', grupo:'E', fechaISO:'2026-06-21T00:00:00Z', fecha:'20 Jun', hora:'21:00', sede:'Miami', local:'Ecuador', visita:'Curazao' },
  { id:'E4', fase:'grupos', grupo:'E', fechaISO:'2026-06-20T04:00:00Z', fecha:'20 Jun', hora:'01:00', sede:'Boston', local:'Túnez', visita:'Japón' },
  { id:'E5', fase:'grupos', grupo:'E', fechaISO:'2026-06-26T23:00:00Z', fecha:'26 Jun', hora:'20:00', sede:'Miami', local:'Costa de Marfil', visita:'Suecia' },
  { id:'E6', fase:'grupos', grupo:'E', fechaISO:'2026-06-26T23:00:00Z', fecha:'26 Jun', hora:'20:00', sede:'Boston', local:'Ecuador', visita:'Túnez' },
  // ── GRUPO F ──
  { id:'F1', fase:'grupos', grupo:'F', fechaISO:'2026-06-15T16:00:00Z', fecha:'15 Jun', hora:'13:00', sede:'Miami', local:'España', visita:'Cabo Verde' },
  { id:'F2', fase:'grupos', grupo:'F', fechaISO:'2026-06-15T19:00:00Z', fecha:'15 Jun', hora:'16:00', sede:'Kansas City', local:'Bélgica', visita:'Egipto' },
  { id:'F3', fase:'grupos', grupo:'F', fechaISO:'2026-06-21T16:00:00Z', fecha:'21 Jun', hora:'13:00', sede:'Kansas City', local:'España', visita:'Arabia Saudita' },
  { id:'F4', fase:'grupos', grupo:'F', fechaISO:'2026-06-21T19:00:00Z', fecha:'21 Jun', hora:'16:00', sede:'Miami', local:'Bélgica', visita:'Irán' },
  { id:'F5', fase:'grupos', grupo:'F', fechaISO:'2026-06-27T21:00:00Z', fecha:'27 Jun', hora:'18:00', sede:'Kansas City', local:'España', visita:'Bélgica' },
  { id:'F6', fase:'grupos', grupo:'F', fechaISO:'2026-06-27T21:00:00Z', fecha:'27 Jun', hora:'18:00', sede:'Miami', local:'Cabo Verde', visita:'Egipto' },
  // ── GRUPO G ──
  { id:'G1', fase:'grupos', grupo:'G', fechaISO:'2026-06-15T22:00:00Z', fecha:'15 Jun', hora:'19:00', sede:'Seattle', local:'Arabia Saudita', visita:'Uruguay' },
  { id:'G2', fase:'grupos', grupo:'G', fechaISO:'2026-06-16T01:00:00Z', fecha:'15 Jun', hora:'22:00', sede:'Houston', local:'Irán', visita:'Nueva Zelanda' },
  { id:'G3', fase:'grupos', grupo:'G', fechaISO:'2026-06-21T16:00:00Z', fecha:'21 Jun', hora:'13:00', sede:'Seattle', local:'Arabia Saudita', visita:'España' },
  { id:'G4', fase:'grupos', grupo:'G', fechaISO:'2026-06-21T22:00:00Z', fecha:'21 Jun', hora:'19:00', sede:'Houston', local:'Uruguay', visita:'Cabo Verde' },
  { id:'G5', fase:'grupos', grupo:'G', fechaISO:'2026-06-27T23:00:00Z', fecha:'27 Jun', hora:'20:00', sede:'Seattle', local:'Arabia Saudita', visita:'Irán' },
  { id:'G6', fase:'grupos', grupo:'G', fechaISO:'2026-06-27T23:00:00Z', fecha:'27 Jun', hora:'20:00', sede:'Houston', local:'Uruguay', visita:'Nueva Zelanda' },
  // ── GRUPO H ──
  { id:'H1', fase:'grupos', grupo:'H', fechaISO:'2026-06-16T19:00:00Z', fecha:'16 Jun', hora:'16:00', sede:'Nueva York', local:'Francia', visita:'Senegal' },
  { id:'H2', fase:'grupos', grupo:'H', fechaISO:'2026-06-16T22:00:00Z', fecha:'16 Jun', hora:'19:00', sede:'San Francisco', local:'Irak', visita:'Noruega' },
  { id:'H3', fase:'grupos', grupo:'H', fechaISO:'2026-06-22T21:00:00Z', fecha:'22 Jun', hora:'18:00', sede:'San Francisco', local:'Francia', visita:'Irak' },
  { id:'H4', fase:'grupos', grupo:'H', fechaISO:'2026-06-23T00:00:00Z', fecha:'22 Jun', hora:'21:00', sede:'Nueva York', local:'Noruega', visita:'Senegal' },
  { id:'H5', fase:'grupos', grupo:'H', fechaISO:'2026-06-27T23:00:00Z', fecha:'27 Jun', hora:'20:00', sede:'Nueva York', local:'Francia', visita:'Noruega' },
  { id:'H6', fase:'grupos', grupo:'H', fechaISO:'2026-06-27T23:00:00Z', fecha:'27 Jun', hora:'20:00', sede:'San Francisco', local:'Senegal', visita:'Irak' },
  // ── GRUPO I ──
  { id:'I1', fase:'grupos', grupo:'I', fechaISO:'2026-06-13T04:00:00Z', fecha:'13 Jun', hora:'01:00', sede:'Dallas', local:'Australia', visita:'Turquía' },
  { id:'I2', fase:'grupos', grupo:'I', fechaISO:'2026-06-13T01:00:00Z', fecha:'12 Jun', hora:'22:00', sede:'Los Ángeles', local:'Estados Unidos', visita:'Paraguay' },
  { id:'I3', fase:'grupos', grupo:'I', fechaISO:'2026-06-19T19:00:00Z', fecha:'19 Jun', hora:'16:00', sede:'Los Ángeles', local:'Estados Unidos', visita:'Australia' },
  { id:'I4', fase:'grupos', grupo:'I', fechaISO:'2026-06-20T04:00:00Z', fecha:'19 Jun', hora:'01:00', sede:'Dallas', local:'Turquía', visita:'Paraguay' },
  { id:'I5', fase:'grupos', grupo:'I', fechaISO:'2026-06-26T23:00:00Z', fecha:'26 Jun', hora:'20:00', sede:'Los Ángeles', local:'Estados Unidos', visita:'Turquía' },
  { id:'I6', fase:'grupos', grupo:'I', fechaISO:'2026-06-26T23:00:00Z', fecha:'26 Jun', hora:'20:00', sede:'Dallas', local:'Australia', visita:'Paraguay' },
  // ── GRUPO J ──
  { id:'J1', fase:'grupos', grupo:'J', fechaISO:'2026-06-17T01:00:00Z', fecha:'16 Jun', hora:'22:00', sede:'Dallas', local:'Argentina', visita:'Argelia' },
  { id:'J2', fase:'grupos', grupo:'J', fechaISO:'2026-06-17T04:00:00Z', fecha:'16 Jun', hora:'01:00', sede:'Seattle', local:'Austria', visita:'Jordania' },
  { id:'J3', fase:'grupos', grupo:'J', fechaISO:'2026-06-22T17:00:00Z', fecha:'22 Jun', hora:'14:00', sede:'Seattle', local:'Argentina', visita:'Austria' },
  { id:'J4', fase:'grupos', grupo:'J', fechaISO:'2026-06-22T03:00:00Z', fecha:'22 Jun', hora:'00:00', sede:'Dallas', local:'Jordania', visita:'Argelia' },
  { id:'J5', fase:'grupos', grupo:'J', fechaISO:'2026-06-28T02:00:00Z', fecha:'27 Jun', hora:'23:00', sede:'Dallas', local:'Jordania', visita:'Argentina' },
  { id:'J6', fase:'grupos', grupo:'J', fechaISO:'2026-06-28T02:00:00Z', fecha:'27 Jun', hora:'23:00', sede:'Seattle', local:'Argelia', visita:'Austria' },
  // ── GRUPO K ──
  { id:'K1', fase:'grupos', grupo:'K', fechaISO:'2026-06-17T17:00:00Z', fecha:'17 Jun', hora:'14:00', sede:'Houston', local:'Portugal', visita:'Uzbekistán' },
  { id:'K2', fase:'grupos', grupo:'K', fechaISO:'2026-06-18T02:00:00Z', fecha:'17 Jun', hora:'23:00', sede:'Atlanta', local:'Colombia', visita:'RD del Congo' },
  { id:'K3', fase:'grupos', grupo:'K', fechaISO:'2026-06-23T17:00:00Z', fecha:'23 Jun', hora:'14:00', sede:'Houston', local:'Portugal', visita:'Colombia' },
  { id:'K4', fase:'grupos', grupo:'K', fechaISO:'2026-06-24T02:00:00Z', fecha:'23 Jun', hora:'23:00', sede:'Atlanta', local:'Uzbekistán', visita:'RD del Congo' },
  { id:'K5', fase:'grupos', grupo:'K', fechaISO:'2026-06-27T23:30:00Z', fecha:'27 Jun', hora:'20:30', sede:'Houston', local:'Colombia', visita:'Portugal' },
  { id:'K6', fase:'grupos', grupo:'K', fechaISO:'2026-06-27T23:30:00Z', fecha:'27 Jun', hora:'20:30', sede:'Atlanta', local:'RD del Congo', visita:'Uzbekistán' },
  // ── GRUPO L ──
  { id:'L1', fase:'grupos', grupo:'L', fechaISO:'2026-06-17T20:00:00Z', fecha:'17 Jun', hora:'17:00', sede:'Nueva York', local:'Inglaterra', visita:'Croacia' },
  { id:'L2', fase:'grupos', grupo:'L', fechaISO:'2026-06-17T23:00:00Z', fecha:'17 Jun', hora:'20:00', sede:'Boston', local:'Ghana', visita:'Panamá' },
  { id:'L3', fase:'grupos', grupo:'L', fechaISO:'2026-06-23T20:00:00Z', fecha:'23 Jun', hora:'17:00', sede:'Boston', local:'Inglaterra', visita:'Ghana' },
  { id:'L4', fase:'grupos', grupo:'L', fechaISO:'2026-06-23T23:00:00Z', fecha:'23 Jun', hora:'20:00', sede:'Nueva York', local:'Panamá', visita:'Croacia' },
  { id:'L5', fase:'grupos', grupo:'L', fechaISO:'2026-06-27T21:00:00Z', fecha:'27 Jun', hora:'18:00', sede:'Nueva York', local:'Panamá', visita:'Inglaterra' },
  { id:'L6', fase:'grupos', grupo:'L', fechaISO:'2026-06-27T21:00:00Z', fecha:'27 Jun', hora:'18:00', sede:'Boston', local:'Croacia', visita:'Ghana' },
  // ── 1/16 (se completan cuando clasifican los equipos) ──
  { id:'R1', fase:'1/16', fechaISO:'2026-07-04T22:00:00Z', fecha:'4 Jul', hora:'19:00', sede:'Dallas', local:'TBD', visita:'TBD' },
  { id:'R2', fase:'1/16', fechaISO:'2026-07-05T01:00:00Z', fecha:'4 Jul', hora:'22:00', sede:'Los Ángeles', local:'TBD', visita:'TBD' },
  { id:'R3', fase:'1/16', fechaISO:'2026-07-05T22:00:00Z', fecha:'5 Jul', hora:'19:00', sede:'Nueva York', local:'TBD', visita:'TBD' },
  { id:'R4', fase:'1/16', fechaISO:'2026-07-06T01:00:00Z', fecha:'5 Jul', hora:'22:00', sede:'Miami', local:'TBD', visita:'TBD' },
  { id:'R5', fase:'1/16', fechaISO:'2026-07-06T22:00:00Z', fecha:'6 Jul', hora:'19:00', sede:'Houston', local:'TBD', visita:'TBD' },
  { id:'R6', fase:'1/16', fechaISO:'2026-07-07T01:00:00Z', fecha:'6 Jul', hora:'22:00', sede:'Seattle', local:'TBD', visita:'TBD' },
  { id:'R7', fase:'1/16', fechaISO:'2026-07-07T22:00:00Z', fecha:'7 Jul', hora:'19:00', sede:'Boston', local:'TBD', visita:'TBD' },
  { id:'R8', fase:'1/16', fechaISO:'2026-07-08T01:00:00Z', fecha:'7 Jul', hora:'22:00', sede:'Atlanta', local:'TBD', visita:'TBD' },
  { id:'R9', fase:'1/16', fechaISO:'2026-07-08T22:00:00Z', fecha:'8 Jul', hora:'19:00', sede:'Kansas City', local:'TBD', visita:'TBD' },
  { id:'R10', fase:'1/16', fechaISO:'2026-07-09T01:00:00Z', fecha:'8 Jul', hora:'22:00', sede:'San Francisco', local:'TBD', visita:'TBD' },
  { id:'R11', fase:'1/16', fechaISO:'2026-07-09T22:00:00Z', fecha:'9 Jul', hora:'19:00', sede:'Toronto', local:'TBD', visita:'TBD' },
  { id:'R12', fase:'1/16', fechaISO:'2026-07-10T01:00:00Z', fecha:'9 Jul', hora:'22:00', sede:'Ciudad de México', local:'TBD', visita:'TBD' },
  { id:'R13', fase:'1/16', fechaISO:'2026-07-10T22:00:00Z', fecha:'10 Jul', hora:'19:00', sede:'Guadalajara', local:'TBD', visita:'TBD' },
  { id:'R14', fase:'1/16', fechaISO:'2026-07-11T01:00:00Z', fecha:'10 Jul', hora:'22:00', sede:'Nueva York', local:'TBD', visita:'TBD' },
  { id:'R15', fase:'1/16', fechaISO:'2026-07-11T22:00:00Z', fecha:'11 Jul', hora:'19:00', sede:'Dallas', local:'TBD', visita:'TBD' },
  { id:'R16', fase:'1/16', fechaISO:'2026-07-12T01:00:00Z', fecha:'11 Jul', hora:'22:00', sede:'Los Ángeles', local:'TBD', visita:'TBD' },
  // ── OCTAVOS ──
  { id:'O1', fase:'octavos', fechaISO:'2026-07-14T22:00:00Z', fecha:'14 Jul', hora:'19:00', sede:'Nueva York', local:'TBD', visita:'TBD' },
  { id:'O2', fase:'octavos', fechaISO:'2026-07-15T01:00:00Z', fecha:'14 Jul', hora:'22:00', sede:'Houston', local:'TBD', visita:'TBD' },
  { id:'O3', fase:'octavos', fechaISO:'2026-07-15T22:00:00Z', fecha:'15 Jul', hora:'19:00', sede:'Miami', local:'TBD', visita:'TBD' },
  { id:'O4', fase:'octavos', fechaISO:'2026-07-16T01:00:00Z', fecha:'15 Jul', hora:'22:00', sede:'Seattle', local:'TBD', visita:'TBD' },
  { id:'O5', fase:'octavos', fechaISO:'2026-07-16T22:00:00Z', fecha:'16 Jul', hora:'19:00', sede:'Dallas', local:'TBD', visita:'TBD' },
  { id:'O6', fase:'octavos', fechaISO:'2026-07-17T01:00:00Z', fecha:'16 Jul', hora:'22:00', sede:'Los Ángeles', local:'TBD', visita:'TBD' },
  { id:'O7', fase:'octavos', fechaISO:'2026-07-17T22:00:00Z', fecha:'17 Jul', hora:'19:00', sede:'Boston', local:'TBD', visita:'TBD' },
  { id:'O8', fase:'octavos', fechaISO:'2026-07-18T01:00:00Z', fecha:'17 Jul', hora:'22:00', sede:'Atlanta', local:'TBD', visita:'TBD' },
  // ── CUARTOS ──
  { id:'Q1', fase:'cuartos', fechaISO:'2026-07-21T22:00:00Z', fecha:'21 Jul', hora:'19:00', sede:'Nueva York', local:'TBD', visita:'TBD' },
  { id:'Q2', fase:'cuartos', fechaISO:'2026-07-22T01:00:00Z', fecha:'21 Jul', hora:'22:00', sede:'Los Ángeles', local:'TBD', visita:'TBD' },
  { id:'Q3', fase:'cuartos', fechaISO:'2026-07-22T22:00:00Z', fecha:'22 Jul', hora:'19:00', sede:'Dallas', local:'TBD', visita:'TBD' },
  { id:'Q4', fase:'cuartos', fechaISO:'2026-07-23T01:00:00Z', fecha:'22 Jul', hora:'22:00', sede:'Miami', local:'TBD', visita:'TBD' },
  // ── SEMIS ──
  { id:'S1', fase:'semis', fechaISO:'2026-07-26T22:00:00Z', fecha:'26 Jul', hora:'19:00', sede:'Dallas', local:'TBD', visita:'TBD' },
  { id:'S2', fase:'semis', fechaISO:'2026-07-27T22:00:00Z', fecha:'27 Jul', hora:'19:00', sede:'Nueva York', local:'TBD', visita:'TBD' },
  // ── 3ER PUESTO ──
  { id:'TP', fase:'3er_puesto', fechaISO:'2026-08-01T22:00:00Z', fecha:'1 Ago', hora:'19:00', sede:'Miami', local:'TBD', visita:'TBD' },
  // ── FINAL ──
  { id:'F', fase:'final', fechaISO:'2026-08-02T22:00:00Z', fecha:'2 Ago', hora:'19:00', sede:'Nueva York', local:'TBD', visita:'TBD' },
];

export const GRUPOS_LIST = ['A','B','C','D','E','F','G','H','I','J','K','L'];

export const FASES_LABEL: Record<Fase, string> = {
  'grupos':      'Fase de Grupos',
  '1/16':        'Dieciseisavos',
  'octavos':     'Octavos de Final',
  'cuartos':     'Cuartos de Final',
  'semis':       'Semifinales',
  '3er_puesto':  'Tercer Puesto',
  'final':       'Final',
};