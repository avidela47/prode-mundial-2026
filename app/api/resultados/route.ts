import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB = 'prode-mundial2026';
const COL = 'resultados';

// GET — todos los resultados
export async function GET() {
  try {
    const client = await clientPromise;
    const resultados = await client.db(DB).collection(COL).find({}).toArray();
    return NextResponse.json(resultados);
  } catch {
    return NextResponse.json({ error: 'Error al obtener resultados' }, { status: 500 });
  }
}

// POST — cargar o actualizar resultado (solo admin)
export async function POST(req: NextRequest) {
  try {
    const { partidoId, gl, gv } = await req.json();
    if (!partidoId || gl === undefined || gv === undefined) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const client = await clientPromise;
    await client.db(DB).collection(COL).updateOne(
      { partidoId },
      { $set: { partidoId, gl: Number(gl), gv: Number(gv), updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error al guardar resultado' }, { status: 500 });
  }
}