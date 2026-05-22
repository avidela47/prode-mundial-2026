import clientPromise from './mongodb';

const DB = 'prode-mundial2026';

export async function getJugadores() {
  const client = await clientPromise;
  return client.db(DB).collection('jugadores').find({}).toArray();
}

export async function getPredicciones(jugadorId?: string) {
  const client = await clientPromise;
  const query = jugadorId ? { jugadorId } : {};
  return client.db(DB).collection('predicciones').find(query).toArray();
}

export async function getResultados() {
  const client = await clientPromise;
  return client.db(DB).collection('resultados').find({}).toArray();
}