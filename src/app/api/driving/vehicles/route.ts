import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST: Add vehicle profile
// GET: List user vehicles
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      make,
      model,
      year,
      type = 'car',
      fuelType = 'diesel',
      transmission = 'manual',
      engineSize,
      vin,
      licensePlate,
      color,
      mileage = 0,
    } = body as {
      userId?: string;
      make: string;
      model: string;
      year: number;
      type?: string;
      fuelType?: string;
      transmission?: string;
      engineSize?: string;
      vin?: string;
      licensePlate?: string;
      color?: string;
      mileage?: number;
    };

    if (!make || !model || !year) {
      return NextResponse.json(
        { error: 'Marque, modèle et année requis' },
        { status: 400 }
      );
    }

    // Find user
    let user;
    if (userId) {
      user = await db.user.findUnique({ where: { email: userId } });
      if (!user) user = await db.user.findUnique({ where: { id: userId } });
    }
    if (!user) {
      user = await db.user.findFirst();
    }
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const vehicle = await db.vehicleProfile.create({
      data: {
        userId: user.id,
        make,
        model,
        year,
        type,
        fuelType,
        transmission,
        engineSize,
        vin,
        licensePlate,
        color,
        mileage,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('[POST /api/driving/vehicles] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du véhicule' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;
    const type = searchParams.get('type') || undefined;

    // Find user
    let user;
    if (userId) {
      user = await db.user.findUnique({ where: { email: userId } });
      if (!user) user = await db.user.findUnique({ where: { id: userId } });
    }
    if (!user) {
      user = await db.user.findFirst();
    }
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const where: Record<string, unknown> = { userId: user.id };
    if (type) where.type = type;

    const vehicles = await db.vehicleProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('[GET /api/driving/vehicles] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des véhicules' },
      { status: 500 }
    );
  }
}
