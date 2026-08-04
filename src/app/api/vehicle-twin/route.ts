import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET — Récupérer les jumeaux numériques du véhicule
export async function GET(request: NextRequest) {
  try {
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!user) {
      return NextResponse.json({ erreur: 'Utilisateur introuvable' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');

    if (vehicleId) {
      const twin = await db.vehicleTwin.findUnique({
        where: { vehicleProfileId: vehicleId },
        include: {
          vehicleProfile: true,
          owner: { select: { id: true, name: true, email: true } },
        },
      });

      if (!twin) {
        return NextResponse.json({ erreur: 'Jumeau numérique introuvable' }, { status: 404 });
      }

      return NextResponse.json({ jumeau: twin });
    }

    const twins = await db.vehicleTwin.findMany({
      where: { ownerUserId: user.id },
      include: {
        vehicleProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ jumeaux: twins, total: twins.length });
  } catch (error) {
    console.error('[GET /api/vehicle-twin] Erreur :', error);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}

// POST — Créer ou mettre à jour un jumeau numérique
export async function POST(request: NextRequest) {
  try {
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!user) {
      return NextResponse.json({ erreur: 'Utilisateur introuvable' }, { status: 404 });
    }

    const body = await request.json();
    const { vehicleProfileId, registration, vin } = body;

    if (!vehicleProfileId) {
      return NextResponse.json({ erreur: 'vehicleProfileId requis' }, { status: 400 });
    }

    // Vérifier que le profil véhicule existe
    const vehicleProfile = await db.vehicleProfile.findUnique({
      where: { id: vehicleProfileId },
    });

    if (!vehicleProfile) {
      return NextResponse.json({ erreur: 'Profil véhicule introuvable' }, { status: 404 });
    }

    // Calculer les métriques depuis les données télémétriques
    const telematicsData = await db.telematicsTrip.aggregate({
      where: { vehicleId: vehicleProfileId },
      _count: true,
      _sum: { distance: true, fuelConsumption: true },
    });

    const totalTrips = telematicsData._count || 0;
    const totalDistance = telematicsData._sum.distance || 0;
    const totalFuelConsumption = telematicsData._sum.fuelConsumption || 0;
    const avgFuelConsumption = totalDistance > 0 ? Math.round((totalFuelConsumption / totalDistance) * 100) / 100 : 0;

    // Calculer le score de santé IA depuis les enregistrements de diagnostic
    const diagnostics = await db.diagnosticRecord.findMany({
      where: { vehicleId: vehicleProfileId },
      select: { severity: true },
    });

    let aiHealthScore = 100;
    if (diagnostics.length > 0) {
      const severityPenalty: Record<string, number> = {
        low: 2,
        medium: 8,
        high: 20,
        critical: 40,
      };
      const totalPenalty = diagnostics.reduce(
        (sum, d) => sum + (severityPenalty[d.severity] || 5),
        0,
      );
      aiHealthScore = Math.max(0, Math.min(100, 100 - totalPenalty));
    }

    // Vérifier le statut d'assurance
    const activePolicy = await db.insurancePolicy.findFirst({
      where: {
        userId: vehicleProfile.userId,
        status: 'active',
      },
    });

    const insuranceStatus = activePolicy ? activePolicy.type : 'unknown';

    // Upsert le jumeau numérique
    const twin = await db.vehicleTwin.upsert({
      where: { vehicleProfileId },
      update: {
        vin: vin || undefined,
        registration: registration || undefined,
        currentMileage: vehicleProfile.mileage,
        totalTrips,
        totalDistance,
        avgFuelConsumption,
        aiHealthScore,
        insuranceStatus,
      },
      create: {
        vehicleProfileId,
        vin: vin || undefined,
        registration: registration || undefined,
        ownerUserId: user.id,
        currentMileage: vehicleProfile.mileage,
        totalTrips,
        totalDistance,
        avgFuelConsumption,
        aiHealthScore,
        insuranceStatus,
      },
      include: {
        vehicleProfile: true,
      },
    });

    return NextResponse.json({
      message: 'Jumeau numérique créé/mis à jour',
      jumeau: twin,
    });
  } catch (error) {
    console.error('[POST /api/vehicle-twin] Erreur :', error);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH — Mettre à jour un jumeau numérique
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ erreur: 'Identifiant requis' }, { status: 400 });
    }

    // Filtrer les champs autorisés
    const allowedFields = [
      'vin', 'registration', 'currentMileage', 'totalTrips', 'totalDistance',
      'avgFuelConsumption', 'aiHealthScore', 'nextServiceDate',
      'nextServiceMileage', 'lastAccidentDate', 'insuranceStatus',
      'recallCount', 'ownershipHistory', 'aiPredictions',
    ] as const;

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if ((updateData as Record<string, unknown>)[field] !== undefined) {
        data[field] = (updateData as Record<string, unknown>)[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ erreur: 'Aucun champ valide à mettre à jour' }, { status: 400 });
    }

    const twin = await db.vehicleTwin.update({
      where: { id },
      data,
      include: {
        vehicleProfile: true,
      },
    });

    return NextResponse.json({
      message: 'Jumeau numérique mis à jour',
      jumeau: twin,
    });
  } catch (error) {
    console.error('[PATCH /api/vehicle-twin] Erreur :', error);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}
