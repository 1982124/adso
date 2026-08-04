import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Get vehicle
// PATCH: Update vehicle
// DELETE: Remove vehicle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicle = await db.vehicleProfile.findUnique({
      where: { id },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Véhicule non trouvé' }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('[GET /api/driving/vehicles/:id] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du véhicule' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
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
    } = body as {
      make?: string;
      model?: string;
      year?: number;
      type?: string;
      fuelType?: string;
      transmission?: string;
      engineSize?: string;
      vin?: string;
      licensePlate?: string;
      color?: string;
      mileage?: number;
    };

    const existing = await db.vehicleProfile.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Véhicule non trouvé' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (make !== undefined) updateData.make = make;
    if (model !== undefined) updateData.model = model;
    if (year !== undefined) updateData.year = year;
    if (type !== undefined) updateData.type = type;
    if (fuelType !== undefined) updateData.fuelType = fuelType;
    if (transmission !== undefined) updateData.transmission = transmission;
    if (engineSize !== undefined) updateData.engineSize = engineSize;
    if (vin !== undefined) updateData.vin = vin;
    if (licensePlate !== undefined) updateData.licensePlate = licensePlate;
    if (color !== undefined) updateData.color = color;
    if (mileage !== undefined) updateData.mileage = mileage;

    const updated = await db.vehicleProfile.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/driving/vehicles/:id] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du véhicule' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.vehicleProfile.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Véhicule non trouvé' }, { status: 404 });
    }

    await db.vehicleProfile.delete({ where: { id } });

    return NextResponse.json({ message: 'Véhicule supprimé avec succès' });
  } catch (error) {
    console.error('[DELETE /api/driving/vehicles/:id] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du véhicule' },
      { status: 500 }
    );
  }
}
