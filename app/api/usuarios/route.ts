import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB = 'prode-mundial2026';
const COL = 'jugadores';

const COLORES = [
  '#C8102E','#003087','#00843D','#C9A84C',
  '#FF6B00','#8B0000','#1B5E20','#4A0080',
  '#005F73','#AE2012','#0077B6','#606C38',
];

// GET — traer todos los jugadores
export async function GET() {
  try {
    const client = await clientPromise;
    const jugadores = await client.db(DB).collection(COL).find({}).toArray();
    return NextResponse.json(jugadores);
  } catch (_e) {
    return NextResponse.json({ error: 'Error al obtener jugadores' }, { status: 500 });
  }
}

// POST — agregar jugador (solo admin)
export async function POST(req: NextRequest) {
  try {
    const { nombre, dni, esAdmin } = await req.json();
    if (!nombre || !dni) {
      return NextResponse.json({ error: 'Nombre y DNI requeridos' }, { status: 400 });
    }

    const client = await clientPromise;
    const col = client.db(DB).collection(COL);

    const existe = await col.findOne({ nombre: nombre.trim() });
    if (existe) {
      return NextResponse.json({ error: 'Ese nombre ya existe' }, { status: 400 });
    }

    const total = await col.countDocuments();
    const color = COLORES[total % COLORES.length];

    const jugador = {
      id: `j_${Date.now()}`,
      nombre: nombre.trim(),
      dni: dni.trim(),
      color,
      esAdmin: esAdmin || false,
      creadoEn: new Date(),
    };

    await col.insertOne(jugador);
    return NextResponse.json(jugador);
  } catch (_e) {
    return NextResponse.json({ error: 'Error al crear jugador' }, { status: 500 });
  }
}

// DELETE — eliminar jugador
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const client = await clientPromise;
    await client.db(DB).collection(COL).deleteOne({ id });
    return NextResponse.json({ ok: true });
  } catch (_e) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}