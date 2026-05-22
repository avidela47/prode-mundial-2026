import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB = 'prode-mundial2026';
const COL = 'predicciones';

// GET — traer predicciones (si viene jugadorId trae las suyas, sino todas)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jugadorId = searchParams.get('jugadorId');

    const client = await clientPromise;
    const query = jugadorId ? { jugadorId } : {};
    const preds = await client.db(DB).collection(COL).find(query).toArray();
    return NextResponse.json(preds);
  } catch {
    return NextResponse.json({ error: 'Error al obtener predicciones' }, { status: 500 });
  }
}

// POST — guardar o actualizar predicción
export async function POST(req: NextRequest) {
  try {
    const { jugadorId, partidoId, valor } = await req.json();
    if (!jugadorId || !partidoId || !valor) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const client = await clientPromise;
    const col = client.db(DB).collection(COL);

    if (valor === '') {
      await col.deleteOne({ jugadorId, partidoId });
      return NextResponse.json({ ok: true });
    }

    await col.updateOne(
      { jugadorId, partidoId },
      { $set: { jugadorId, partidoId, valor, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error al guardar predicción' }, { status: 500 });
  }
}