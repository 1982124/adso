import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedCountries } from '../../../../seed-data/seed-countries';
import { seedLicenseCategories } from '../../../../seed-data/seed-licenses';
import { seedRoadSigns } from '../../../../seed-data/seed-signs';
import { seedQuestions } from '../../../../seed-data/seed-questions';
import { seedPracticalExercises } from '../../../../seed-data/seed-practical';
import { requireRole } from '@/lib/auth';

// ═══════════════════════════════════════════════════════════
// V4.2 Seed — Données de démonstration complètes
// ═══════════════════════════════════════════════════════════

async function seedV42Data(userId: string) {
  const counts: Record<string, number> = {};

  // ─── Assurance ───
  // Vérifier si les données d'assurance existent déjà
  const existingPolicies = await db.insurancePolicy.count({ where: { userId } });
  if (existingPolicies === 0) {
    const p1 = await db.insurancePolicy.create({
      data: {
        userId,
        provider: 'AXA France',
        policyNumber: 'AXA-2024-789456',
        type: 'comprehensive',
        vehicleType: 'car',
        coverage: JSON.stringify({ responsabilite_civile: true, dommages_collision: true, vol: true, bris_glace: true, assistance: true, franchise: 300 }),
        premium: 820,
        deductible: 300,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2025-01-14'),
        status: 'active',
        paydEnabled: true,
        phydEnabled: true,
      },
    });
    const p2 = await db.insurancePolicy.create({
      data: {
        userId,
        provider: 'MAIF',
        policyNumber: 'MAIF-2024-321654',
        type: 'third_party',
        vehicleType: 'car',
        coverage: JSON.stringify({ responsabilite_civile: true, dommages_collision: false, vol: false, franchise: 150 }),
        premium: 420,
        deductible: 150,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-02-28'),
        status: 'active',
        paydEnabled: false,
        phydEnabled: false,
      },
    });
    const p3 = await db.insurancePolicy.create({
      data: {
        userId,
        provider: 'Groupama',
        policyNumber: 'GRP-2024-987321',
        type: 'collision',
        vehicleType: 'car',
        coverage: JSON.stringify({ responsabilite_civile: true, dommages_collision: true, franchise: 500 }),
        premium: 680,
        deductible: 500,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2025-05-31'),
        status: 'active',
        paydEnabled: true,
        phydEnabled: false,
      },
    });
    counts.insurancePolicies = 3;

    // Sinistres
    const c1 = await db.insuranceClaim.create({
      data: {
        userId,
        policyId: p1.id,
        type: 'collision',
        status: 'approved',
        description: 'Collision arrière à un feu rouge sur le Boulevard Haussmann. Autre véhicule impliqué avec dommages au pare-chocs et au coffre.',
        damageAssessment: JSON.stringify({ pare_chocs_arriere: 'remplacement', coffre: 'reparation', feux_arriere: 'ok' }),
        estimatedCost: 2400,
        approvedAmount: 2100,
        faultDetermination: JSON.stringify({ fault: '50/50', reason: 'circulation en file inégale' }),
        location: 'Boulevard Haussmann, Paris 9ème',
        latitude: 48.8738,
        longitude: 2.3288,
        incidentDate: new Date('2024-08-12T14:30:00'),
      },
    });
    const c2 = await db.insuranceClaim.create({
      data: {
        userId,
        policyId: p1.id,
        type: 'weather',
        status: 'pending',
        description: 'Dommages causés par la tempête Ciarán — branches tombées sur le véhicule, toiture et capot rayés.',
        estimatedCost: 1800,
        location: 'Rue de Rivoli, Paris 4ème',
        latitude: 48.8566,
        longitude: 2.3522,
        incidentDate: new Date('2024-11-03T08:15:00'),
      },
    });
    counts.insuranceClaims = 2;

    // Évaluation de dommages liée au sinistre approuvé
    await db.damageAssessment.create({
      data: {
        claimId: c1.id,
        bumperScore: 25,
        doorsScore: 90,
        hoodScore: 95,
        windshieldScore: 100,
        lightsScore: 70,
        wheelsScore: 95,
        chassisScore: 98,
        overallSeverity: 'modéré',
        estimatedRepairCost: 2100,
        estimatedRepairDuration: '3 jours ouvrés',
        replacementParts: JSON.stringify(['Pare-chocs arrière Renault', 'Catadioptre droit']),
        photos: JSON.stringify(['https://cdn.example.com/dmg1.jpg', 'https://cdn.example.com/dmg2.jpg']),
      },
    });
    counts.damageAssessments = 1;

    // Alerte fraude
    await db.fraudAlert.create({
      data: {
        userId,
        claimId: c2.id,
        type: 'inflation_dommages',
        probability: 35,
        description: 'Le coût estimé des dommages semble élevé par rapport aux photos soumises. Analyse IA en cours.',
        evidence: JSON.stringify({ motifs: ['coût_inflé', 'photos_insuffisantes', 'localisation_incohérente'] }),
        status: 'pending',
      },
    });
    counts.fraudAlerts = 1;

    // Incident accident
    await db.accidentIncident.create({
      data: {
        userId,
        policyId: p1.id,
        type: 'rear_collision',
        severity: 'medium',
        latitude: 48.8738,
        longitude: 2.3288,
        speed: 15,
        deceleration: -8.5,
        timestamp: new Date('2024-08-12T14:30:00'),
        resolved: true,
        claimId: c1.id,
      },
    });
    counts.accidentIncidents = 1;
  } else {
    counts.insurancePolicies = existingPolicies;
    counts.insuranceClaims = await db.insuranceClaim.count({ where: { userId } });
  }

  // Score de confiance
  const existingTrust = await db.trustScore.findFirst({ where: { userId } });
  if (!existingTrust) {
    await db.trustScore.create({
      data: {
        userId,
        overallScore: 72,
        drivingQuality: 78,
        mechanicalHealth: 85,
        maintenanceQuality: 70,
        learningProgress: 65,
        examPerformance: 58,
        telematicsScore: 74,
        accidentHistory: 55,
        fraudRisk: 12,
        compliance: 90,
        factors: JSON.stringify({
          points_licence_restants: 10,
          ancienneté_permis: 3,
          nombre_accidents_3ans: 1,
          km_annuels: 15000,
          note_conduite_ia: 78,
          age: 28,
        }),
      },
    });
    counts.trustScores = 1;
  } else {
    counts.trustScores = 1;
  }

  // ─── Télémétrie ───
  const existingTelematics = await db.telematicsTrip.count({ where: { userId } });
  if (existingTelematics === 0) {
    // Récupérer les profils de véhicule
    const vehicles = await db.vehicleProfile.findMany({ where: { userId } });
    const vehicleId = vehicles.length > 0 ? vehicles[0].id : null;

    const trips = [
      { start: '12 Rue de la Paix, Paris', end: '85 Avenue des Champs-Élysées, Paris', dist: 5.2, dur: 18, avg: 17, max: 52, fuel: 0.52, score: 88, eco: 82, weather: 'clear', road: 'urban', hb: 0, ha: 0, sv: 0, night: 0, city: 5.2, hwy: 0 },
      { start: '15 Quai de la Tournelle, Paris', end: 'Place de la Bastille, Paris', dist: 3.8, dur: 14, avg: 16, max: 45, fuel: 0.41, score: 92, eco: 88, weather: 'clear', road: 'urban', hb: 0, ha: 0, sv: 0, night: 0, city: 3.8, hwy: 0 },
      { start: 'Porte de Versailles, Paris', end: 'Aéroport CDG Terminal 2', dist: 32.5, dur: 42, avg: 46, max: 120, fuel: 3.2, score: 78, eco: 71, weather: 'clear', road: 'highway', hb: 1, ha: 0, sv: 0, night: 0, city: 5, hwy: 27.5 },
      { start: 'Gare de Lyon, Paris', end: 'Place Bellecour, Lyon', dist: 465, dur: 260, avg: 107, max: 130, fuel: 42, score: 82, eco: 75, weather: 'clear', road: 'highway', hb: 0, ha: 1, sv: 1, night: 45, city: 8, hwy: 457 },
      { start: 'Vieux Port, Marseille', end: 'Calanque de Sormiou', dist: 12.4, dur: 28, avg: 26, max: 60, fuel: 1.5, score: 72, eco: 65, weather: 'clear', road: 'rural', hb: 1, ha: 0, sv: 0, night: 0, city: 3, hwy: 5, rural: 4.4 },
      { start: 'Place de la Comédie, Montpellier', end: 'Pont du Gard', dist: 28.3, dur: 35, avg: 48, max: 110, fuel: 2.8, score: 80, eco: 76, weather: 'rain', road: 'rural', hb: 0, ha: 0, sv: 0, night: 0, city: 4, hwy: 18, rural: 6.3 },
      { start: 'Place de la Bourse, Bordeaux', end: 'Château Margaux', dist: 25.6, dur: 32, avg: 48, max: 90, fuel: 2.5, score: 85, eco: 80, weather: 'clear', road: 'rural', hb: 0, ha: 0, sv: 0, night: 0, city: 5, hwy: 15, rural: 5.6 },
      { start: 'Place du Capitole, Toulouse', end: 'Aéroport Toulouse-Blagnac', dist: 12.8, dur: 22, avg: 35, max: 80, fuel: 1.3, score: 90, eco: 86, weather: 'fog', road: 'urban', hb: 0, ha: 0, sv: 0, night: 0, city: 8, hwy: 4.8 },
      { start: 'Gare Montparnasse, Paris', end: 'Versailles Château', dist: 22.1, dur: 40, avg: 33, max: 85, fuel: 2.2, score: 76, eco: 68, weather: 'rain', road: 'urban', hb: 2, ha: 1, sv: 0, night: 0, city: 15, hwy: 7.1 },
      { start: 'Gare du Nord, Paris', end: 'Parc Asterix, Plailly', dist: 38.7, dur: 45, avg: 52, max: 125, fuel: 3.9, score: 70, eco: 62, weather: 'clear', road: 'highway', hb: 1, ha: 1, sv: 1, night: 0, city: 6, hwy: 32.7 },
      { start: 'Centre-ville, Nantes', end: 'Saint-Nazaire, Port', dist: 62.5, dur: 55, avg: 68, max: 130, fuel: 5.8, score: 83, eco: 78, weather: 'clear', road: 'highway', hb: 0, ha: 0, sv: 0, night: 0, city: 5, hwy: 57.5 },
      { start: 'Place Kléber, Strasbourg', end: 'Colmar, Centre', dist: 72.4, dur: 60, avg: 72, max: 130, fuel: 6.5, score: 86, eco: 81, weather: 'clear', road: 'highway', hb: 0, ha: 0, sv: 0, night: 12, city: 6, hwy: 66.4 },
      { start: 'Place des Vosges, Paris', end: 'Disneyland Paris', dist: 45.3, dur: 55, avg: 49, max: 118, fuel: 4.6, score: 75, eco: 69, weather: 'clear', road: 'highway', hb: 1, ha: 0, sv: 0, night: 0, city: 8, hwy: 37.3 },
      { start: 'Quai des Belges, Marseille', end: 'Aix-en-Provence, Cours Mirabeau', dist: 32.1, dur: 38, avg: 51, max: 95, fuel: 3.1, score: 79, eco: 73, weather: 'clear', road: 'mixed', hb: 0, ha: 1, sv: 0, night: 0, city: 10, hwy: 22.1 },
      { start: 'Place Jean Jaurès, Lille', end: 'Vieux-Lille, Grand Place', dist: 4.5, dur: 15, avg: 18, max: 42, fuel: 0.48, score: 95, eco: 92, weather: 'clear', road: 'urban', hb: 0, ha: 0, sv: 0, night: 0, city: 4.5, hwy: 0 },
    ];

    for (const t of trips) {
      const startTime = new Date();
      startTime.setMinutes(startTime.getMinutes() - t.dur);
      await db.telematicsTrip.create({
        data: {
          userId,
          vehicleId,
          startAddress: t.start,
          endAddress: t.end,
          distance: t.dist,
          duration: t.dur * 60,
          avgSpeed: t.avg,
          maxSpeed: t.max,
          fuelConsumption: t.fuel,
          fuelCost: t.fuel * 1.85,
          harshBrakes: t.hb,
          harshAccel: t.ha,
          speedViolations: t.sv,
          nightDriving: t.night,
          cityDriving: t.city || 0,
          highwayDriving: t.hwy,
          drivingScore: t.score,
          ecoScore: t.eco,
          weather: t.weather,
          roadType: t.road,
          startTime,
          endTime: new Date(),
        },
      });
    }
    counts.telematicsTrips = 15;
  } else {
    counts.telematicsTrips = existingTelematics;
  }

  // ─── Flotte ───
  const existingFleet = await db.fleetOrganization.findFirst({ where: { name: 'Flotte ADSO Demo' } });
  if (!existingFleet) {
    const fleet = await db.fleetOrganization.create({
      data: {
        name: 'Flotte ADSO Demo',
        description: 'Flotte de démonstration pour le système de gestion de flotte ADSO',
        country: 'FR',
        plan: 'professional',
        maxVehicles: 20,
        maxDrivers: 15,
      },
    });
    counts.fleetOrganizations = 1;

    // Véhicules de flotte
    const fv1 = await db.fleetVehicle.create({
      data: { fleetId: fleet.id, make: 'Renault', model: 'Kangoo E-Tech', year: 2023, type: 'car', fuelType: 'electric', licensePlate: 'AB-123-CD', mileage: 28500, status: 'active', purchaseDate: new Date('2023-03-15'), purchasePrice: 28000, lastInspection: new Date('2024-06-01'), nextService: new Date('2025-01-15') },
    });
    const fv2 = await db.fleetVehicle.create({
      data: { fleetId: fleet.id, make: 'Peugeot', model: '308', year: 2022, type: 'car', fuelType: 'diesel', licensePlate: 'EF-456-GH', mileage: 52300, status: 'active', purchaseDate: new Date('2022-06-01'), purchasePrice: 24500, lastInspection: new Date('2024-05-20'), nextService: new Date('2025-02-10') },
    });
    const fv3 = await db.fleetVehicle.create({
      data: { fleetId: fleet.id, make: 'Citroën', model: 'Jumpy', year: 2021, type: 'truck', fuelType: 'diesel', licensePlate: 'IJ-789-KL', mileage: 87600, status: 'maintenance', purchaseDate: new Date('2021-09-10'), purchasePrice: 32000, lastInspection: new Date('2024-04-15'), nextService: new Date('2024-12-01') },
    });
    const fv4 = await db.fleetVehicle.create({
      data: { fleetId: fleet.id, make: 'Dacia', model: 'Spring', year: 2024, type: 'car', fuelType: 'electric', licensePlate: 'MN-012-OP', mileage: 8200, status: 'active', purchaseDate: new Date('2024-01-20'), purchasePrice: 18500, lastInspection: new Date('2024-07-01'), nextService: new Date('2025-07-01') },
    });
    counts.fleetVehicles = 4;

    // Chauffeurs (un seul possible car userId est unique)
    const fd1 = await db.fleetDriver.create({
      data: { userId, fleetId: fleet.id, licenseNumber: '12AB34567', licenseExpiry: new Date('2027-06-30'), licenseType: 'B', status: 'active', drivingScore: 82, totalTrips: 464, totalDistance: 38600 },
    });
    counts.fleetDrivers = 1;

    // Enregistrements de maintenance
    await db.maintenanceRecord.createMany({
      data: [
        { userId, fleetVehicleId: fv1.id, type: 'routine', description: 'Révision annuelle — vérification freins, pneus, liquides', cost: 180, performedBy: 'Garage Renault Paris', performedAt: new Date('2024-06-15'), nextDueDate: new Date('2025-06-15'), nextDueMileage: 40000, status: 'completed', parts: JSON.stringify(['Plaquettes avant', 'Filtre habitacle']) },
        { userId, fleetVehicleId: fv2.id, type: 'repair', description: 'Remplacement alternateur défaillant', cost: 450, performedBy: 'Auto Service Lyon', performedAt: new Date('2024-08-22'), nextDueDate: new Date('2025-08-22'), status: 'completed', parts: JSON.stringify(['Alternateur Peugeot 308']) },
        { userId, fleetVehicleId: fv3.id, type: 'brake', description: 'Remplacement plaquettes et disques de frein arrière', cost: 320, performedBy: 'Centre Auto Marseille', performedAt: new Date('2024-10-05'), status: 'in_progress', parts: JSON.stringify(['Disques arrière', 'Plaquettes arrière']) },
        { userId, fleetVehicleId: fv3.id, type: 'oil', description: 'Vidange huile moteur et filtre à huile', cost: 85, performedBy: 'Quick Service Bordeaux', performedAt: new Date('2024-09-10'), nextDueDate: new Date('2025-03-10'), nextDueMileage: 95000, status: 'completed', parts: JSON.stringify(['Huile 5W30 5L', 'Filtre à huile']) },
        { userId, fleetVehicleId: fv4.id, type: 'tire', description: 'Rotation pneus et vérification pression', cost: 40, performedBy: 'Pneu Express Toulouse', performedAt: new Date('2024-11-01'), nextDueDate: new Date('2025-05-01'), nextDueMileage: 20000, status: 'completed' },
      ],
    });
    counts.maintenanceRecords = 5;

    // Enregistrements carburant
    await db.fuelRecord.createMany({
      data: [
        { userId, fleetVehicleId: fv1.id, fuelType: 'electric', quantity: 42, costPerLiter: 0.18, totalCost: 7.56, odometer: 28000, fuelingDate: new Date('2024-11-10'), stationName: 'Ionity Paris La Défense', location: 'Paris La Défense' },
        { userId, fleetVehicleId: fv2.id, fuelType: 'diesel', quantity: 45, costPerLiter: 1.75, totalCost: 78.75, odometer: 51800, fuelingDate: new Date('2024-11-08'), stationName: 'TotalEnergies Lyon', location: 'Lyon 6ème' },
        { userId, fleetVehicleId: fv2.id, fuelType: 'diesel', quantity: 50, costPerLiter: 1.72, totalCost: 86, odometer: 51000, fuelingDate: new Date('2024-10-25'), stationName: 'BP Marseille Vieux Port', location: 'Marseille' },
        { userId, fleetVehicleId: fv3.id, fuelType: 'diesel', quantity: 60, costPerLiter: 1.78, totalCost: 106.8, odometer: 87000, fuelingDate: new Date('2024-11-05'), stationName: 'Shell Bordeaux Centre', location: 'Bordeaux' },
        { userId, fleetVehicleId: fv3.id, fuelType: 'diesel', quantity: 55, costPerLiter: 1.80, totalCost: 99, odometer: 86200, fuelingDate: new Date('2024-10-18'), stationName: 'Esso Toulouse Blagnac', location: 'Toulouse' },
        { userId, fleetVehicleId: fv4.id, fuelType: 'electric', quantity: 28, costPerLiter: 0.20, totalCost: 5.60, odometer: 7800, fuelingDate: new Date('2024-11-12'), stationName: 'Tesla SC Paris', location: 'Paris 15ème' },
      ],
    });
    counts.fuelRecords = 6;

    // Affectations (un seul chauffeur affecté à 3 véhicules)
    await db.fleetAssignment.createMany({
      data: [
        { fleetId: fleet.id, vehicleId: fv1.id, driverId: fd1.id, startDate: new Date('2024-01-15'), status: 'active', notes: 'Livraisons urbaines Paris' },
        { fleetId: fleet.id, vehicleId: fv2.id, driverId: fd1.id, startDate: new Date('2024-02-01'), status: 'active', notes: 'Tournées régionales Rhône-Alpes' },
        { fleetId: fleet.id, vehicleId: fv4.id, driverId: fd1.id, startDate: new Date('2024-03-10'), status: 'active', notes: 'Navette entreprise Toulouse' },
      ],
    });
    counts.fleetAssignments = 3;
  } else {
    counts.fleetOrganizations = 1;
  }

  // ─── Sécurité ───
  const existingSecurity = await db.securityEvent.count({ where: { userId } });
  if (existingSecurity === 0) {
    await db.securityEvent.createMany({
      data: [
        { userId, type: 'movement', severity: 'warning', address: 'Rue de Rivoli, Paris', latitude: 48.8566, longitude: 2.3522, speed: 12, timestamp: new Date('2024-11-10T03:22:00'), resolved: true, resolvedAt: new Date('2024-11-10T03:25:00'), response: JSON.stringify({ action: 'notification_envoyée', délai: '3 min' }) },
        { userId, type: 'geofence_exit', severity: 'warning', address: 'Périphérique Nord, Porte de Clignancourt', latitude: 48.8992, longitude: 2.3486, speed: 65, timestamp: new Date('2024-11-08T22:45:00'), resolved: true, resolvedAt: new Date('2024-11-08T23:00:00'), response: JSON.stringify({ action: 'zone_habituelle', raison: 'retour_domicile_tardif' }) },
        { userId, type: 'speed_alert', severity: 'warning', latitude: 48.8584, longitude: 2.2945, speed: 138, timestamp: new Date('2024-11-05T09:15:00'), resolved: true, response: JSON.stringify({ action: 'alerte_conducteur', limite: 130 }) },
        { userId, type: 'impact', severity: 'critical', address: 'Parking République, Paris', latitude: 48.8675, longitude: 2.3637, timestamp: new Date('2024-11-01T14:30:00'), resolved: true, resolvedAt: new Date('2024-11-01T14:35:00'), response: JSON.stringify({ action: 'notification_urgence', gravité: 'léger' }) },
        { userId, type: 'engine_start', severity: 'info', address: 'Rue de la Paix, Paris', latitude: 48.8670, longitude: 2.3321, timestamp: new Date('2024-10-28T07:45:00'), resolved: true, response: JSON.stringify({ action: 'démarrage_normal' }) },
        { userId, type: 'geofence_enter', severity: 'info', address: 'ZAD Renault, Flins', latitude: 48.9467, longitude: 1.9025, timestamp: new Date('2024-10-25T10:00:00'), resolved: true, response: JSON.stringify({ action: 'entrée_zone_maintenance' }) },
        { userId, type: 'tow', severity: 'critical', address: 'Boulevard de Sébastopol, Paris', latitude: 48.8625, longitude: 2.3488, speed: 35, timestamp: new Date('2024-10-20T16:50:00'), resolved: false, notified: JSON.stringify(['propriétaire', 'police', 'assureur']) },
        { userId, type: 'door', severity: 'info', latitude: 48.8738, longitude: 2.3288, timestamp: new Date('2024-10-15T18:30:00'), resolved: true, response: JSON.stringify({ action: 'ouverture_portière_passager' }) },
      ],
    });
    counts.securityEvents = 8;
  } else {
    counts.securityEvents = existingSecurity;
  }

  // ─── Marketplace ───
  const existingListings = await db.marketplaceListing.count({ where: { userId } });
  if (existingListings === 0) {
    const listings = [
      { title: 'Garage Central Paris', description: 'Garage automobile de confiance depuis 1985. Réparation, entretien, diagnostic électronique. Toutes marques.', category: 'garage', price: 65, priceUnit: 'hourly', location: '45 Rue de la Glacière, Paris 13ème', city: 'Paris', latitude: 48.8341, longitude: 2.3478, contactPhone: '01 45 67 89 01', contactEmail: 'contact@garage-central-paris.fr', openingHours: JSON.stringify({ lun: '08:00-18:00', mar: '08:00-18:00', mer: '08:00-18:00', jeu: '08:00-18:00', ven: '08:00-18:00', sam: '09:00-13:00' }), services: JSON.stringify(['mécanique_générale', 'diagnostique_électronique', 'climatisation', 'freinage', 'vidange']), certifications: JSON.stringify(['R2A', 'DNV GL', 'Constructeurs_partenaires']) },
      { title: 'Auto Pièces Lyon', description: 'Vente de pièces détachées neufs et occasion. Stock de 25 000 références. Livraison 24h en Île-de-France.', category: 'parts', price: 0, priceUnit: 'fixed', location: '12 Avenue Jean Jaurès, Lyon 6ème', city: 'Lyon', latitude: 45.7640, longitude: 4.8357, contactPhone: '04 78 12 34 56', contactEmail: 'ventes@autopieces-lyon.fr', openingHours: JSON.stringify({ lun: '08:30-12:30,14:00-18:00', mar: '08:30-12:30,14:00-18:00', mer: '08:30-12:30,14:00-18:00', jeu: '08:30-12:30,14:00-18:00', ven: '08:30-12:30,14:00-18:00', sam: '09:00-12:00' }) },
      { title: 'Dépannage 24h Marseille', description: 'Service de dépannage et remorquage 24h/24, 7j/7. Intervention moyenne en 25 minutes sur Marseille et agglomération.', category: 'towing', price: 95, priceUnit: 'per_service', location: 'Vieux Port, Marseille', city: 'Marseille', latitude: 43.2965, longitude: 5.3698, contactPhone: '04 91 23 45 67', contactEmail: 'depannage@remorquage-marseille.fr', openingHours: JSON.stringify({ tous_jours: '24h/24' }), services: JSON.stringify(['remorquage', 'dépannage_sur_place', 'crevaison', 'batterie', 'carburant']) },
      { title: 'École de Conduite Bordeaux', description: 'École de conduite certifiée. Permis B, conduite supervisée, formation post-permis. Taux de réussite 89%.', category: 'driving_school', price: 45, priceUnit: 'hourly', location: '28 Cours de la Somme, Bordeaux', city: 'Bordeaux', latitude: 44.8379, longitude: -0.5792, contactPhone: '05 56 34 56 78', contactEmail: 'info@ecole-conduite-bordeaux.fr', openingHours: JSON.stringify({ lun: '08:00-19:00', mar: '08:00-19:00', mer: '08:00-19:00', jeu: '08:00-19:00', ven: '08:00-19:00', sam: '09:00-13:00' }), certifications: JSON.stringify(['Éducation_Nationale', 'Assurance_qualité']) },
      { title: 'Station ElectriCitToulouse', description: 'Station de recharge rapide pour véhicules électriques. 8 bornes 150kW DC. Café et boutique.', category: 'charging', price: 0.42, priceUnit: 'per_service', location: 'Place du Capitole, Toulouse', city: 'Toulouse', latitude: 43.6047, longitude: 1.4442, contactPhone: '05 61 45 67 89', contactEmail: 'contact@electricitt.fr', openingHours: JSON.stringify({ tous_jours: '06:00-22:00' }), services: JSON.stringify(['recharge_rapide_150kW', 'recharge_normale_22kW', 'café', 'boutique_accessoires']) },
      { title: 'Centre de Contrôle Technique Nantes', description: 'Centre de contrôle technique agréé. Prise en charge rapide, résultat immédiat. Convient aux particuliers et professionnels.', category: 'inspection', price: 79, priceUnit: 'per_service', location: '15 Boulevard de la Prairie, Nantes', city: 'Nantes', latitude: 47.2184, longitude: -1.5536, contactPhone: '02 40 56 78 90', contactEmail: 'rdv@ct-nantes.fr', openingHours: JSON.stringify({ lun: '08:00-12:00,14:00-18:00', mar: '08:00-12:00,14:00-18:00', mer: '08:00-12:00,14:00-18:00', jeu: '08:00-12:00,14:00-18:00', ven: '08:00-12:00,14:00-18:00', sam: '08:30-12:00' }) },
      { title: 'Pneu Online Strasbourg', description: 'Spécialiste du pneu. Montage, équilibrage, permutation. Toutes marques aux meilleurs prix. Livraison gratuite.', category: 'parts', subcategory: 'tires', price: 25, priceUnit: 'per_service', location: '8 Rue du Vieux Marché aux Grains, Strasbourg', city: 'Strasbourg', latitude: 48.5797, longitude: 7.7416, contactPhone: '03 88 67 89 01', contactEmail: 'contact@pneu-online-strasbourg.fr' },
      { title: 'Assurance Auto Marseille', description: 'Courtier en assurance automobile. Comparaison des meilleures offres. Réduction ADSO jusqu\'à -25%.', category: 'insurance', price: 0, priceUnit: 'fixed', location: '22 Rue Saint-Ferréol, Marseille', city: 'Marseille', latitude: 43.2969, longitude: 5.3811, contactPhone: '04 91 89 01 23', contactEmail: 'devis@assurance-auto-marseille.fr' },
      { title: 'Location Véhicules Lille', description: 'Location de véhicules utilitaires et particuliers. Courte et longue durée. Flotte récente.', category: 'rental', price: 39, priceUnit: 'daily', location: '55 Rue de Solferino, Lille', city: 'Lille', latitude: 50.6292, longitude: 3.0573, contactPhone: '03 20 12 34 56', contactEmail: 'reservation@location-lille.fr', openingHours: JSON.stringify({ lun: '07:30-19:00', mar: '07:30-19:00', mer: '07:30-19:00', jeu: '07:30-19:00', ven: '07:30-19:00', sam: '08:00-12:00', dim: '09:00-11:00' }) },
      { title: 'Accessoires Auto Nice', description: 'Boutique d\'accessoires automobiles. Autoradios, GPS, éclairage, entretien. Installation en boutique.', category: 'accessories', price: 0, priceUnit: 'fixed', location: '7 Avenue Jean Médecin, Nice', city: 'Nice', latitude: 43.6958, longitude: 7.2583, contactPhone: '04 93 45 67 89', contactEmail: 'boutique@accessoires-auto-nice.fr' },
    ];

    const listingIds: string[] = [];
    for (const l of listings) {
      const listing = await db.marketplaceListing.create({
        data: {
          userId,
          title: l.title,
          description: l.description,
          category: l.category,
          subcategory: l.subcategory || null,
          price: l.price,
          priceUnit: l.priceUnit || null,
          location: l.location,
          city: l.city || null,
          latitude: l.latitude,
          longitude: l.longitude,
          contactPhone: l.contactPhone || null,
          contactEmail: l.contactEmail || null,
          openingHours: l.openingHours ? JSON.stringify(l.openingHours) : null,
          services: l.services ? JSON.stringify(l.services) : null,
          certifications: l.certifications ? JSON.stringify(l.certifications) : null,
        },
      });
      listingIds.push(listing.id);
    }
    counts.marketplaceListings = 10;

    // Avis
    await db.listingReview.createMany({
      data: [
        { userId, listingId: listingIds[0], rating: 5, title: 'Excellent garage', comment: 'Service rapide et professionnel. Le diagnostic était précis et les réparations impeccables.' },
        { userId, listingId: listingIds[0], rating: 4, title: 'Très bon travail', comment: 'Bon rapport qualité-prix, un peu d\'attente pour le rendez-vous mais travail soigné.' },
        { userId, listingId: listingIds[3], rating: 5, title: 'Formation top', comment: 'Moniteur très patient et pédagogue. J\'ai réussi mon permis du premier coup !' },
        { userId, listingId: listingIds[2], rating: 4, title: 'Intervention rapide', comment: 'Dépanneur arrivé en 20 minutes. Très professionnel et efficace.' },
        { userId, listingId: listingIds[4], rating: 4, title: 'Bornes pratiques', comment: 'Bon emplacement, bornes rapides et café agréable en attendant.' },
      ],
    });
    counts.listingReviews = 5;

    // Réservations
    await db.bookingRecord.createMany({
      data: [
        { userId, listingId: listingIds[0], serviceDate: new Date('2024-12-10'), serviceTime: '09:00', duration: 120, status: 'confirmed', totalAmount: 130, notes: 'Révision annuelle Kangoo E-Tech' },
        { userId, listingId: listingIds[5], serviceDate: new Date('2024-12-15'), serviceTime: '10:30', duration: 45, status: 'pending', totalAmount: 79, notes: 'Contrôle technique Peugeot 308' },
        { userId, listingId: listingIds[3], serviceDate: new Date('2024-12-20'), serviceTime: '14:00', duration: 90, status: 'confirmed', totalAmount: 45, notes: 'Leçon de conduite perfectionnement' },
      ],
    });
    counts.bookingRecords = 3;
  } else {
    counts.marketplaceListings = existingListings;
  }

  // ─── Gouvernement — Infractions routières ───
  const existingViolations = await db.trafficViolation.count({ where: { userId } });
  if (existingViolations === 0) {
    await db.trafficViolation.createMany({
      data: [
        { userId, violationType: 'speeding', description: 'Excès de vitesse de 23 km/h au-dessus de la limite autorisée (130 km/h relevé à 153 km/h). Radar automatique A10.', severity: 'moderate', points: 3, fineAmount: 135, location: 'Autoroute A10, km 142, direction Paris', latitude: 48.7211, longitude: 2.1453, vehicleType: 'car', licensePlate: 'AB-123-CD', status: 'paid', incidentDate: new Date('2024-09-15T10:22:00') },
        { userId, violationType: 'parking', description: 'Stationnement gênant sur passage piéton. Place réservée aux personnes à mobilité réduite.', severity: 'minor', points: 0, fineAmount: 135, location: 'Rue du Faubourg Saint-Honoré, Paris 8ème', latitude: 48.8716, longitude: 2.3199, vehicleType: 'car', licensePlate: 'AB-123-CD', status: 'paid', incidentDate: new Date('2024-07-22T16:40:00') },
        { userId, violationType: 'phone_use', description: 'Utilisation du téléphone tenu en main pendant la conduite. Contrôle routier par les forces de l\'ordre.', severity: 'moderate', points: 2, fineAmount: 135, location: 'Boulevard de Sébastopol, Paris', latitude: 48.8625, longitude: 2.3488, vehicleType: 'car', status: 'confirmed', incidentDate: new Date('2024-08-05T08:15:00') },
        { userId, violationType: 'red_light', description: 'Franchissement d\'un feu rouge. Carrefour équipé d\'un dispositif de contrôle automatisé.', severity: 'moderate', points: 4, fineAmount: 135, location: 'Carrefour Rivoli-Sébastopol, Paris', latitude: 48.8570, longitude: 2.3480, vehicleType: 'car', status: 'paid', incidentDate: new Date('2024-06-18T19:05:00') },
        { userId, violationType: 'no_seatbelt', description: 'Non-port de la ceinture de sécurité. Contrôle routier systématique.', severity: 'minor', points: 0, fineAmount: 135, location: 'Périphérique Intérieur, Porte d\'Orléans', latitude: 48.8242, longitude: 2.3325, vehicleType: 'car', status: 'dismissed', incidentDate: new Date('2024-05-10T17:30:00') },
        { userId, violationType: 'speeding', description: 'Excès de vitesse de 8 km/h en agglomération (50 km/h relevé à 58 km/h). Radar automatique.', severity: 'minor', points: 1, fineAmount: 68, location: 'Avenue de la République, Lyon 3ème', latitude: 45.7600, longitude: 4.8600, vehicleType: 'car', status: 'paid', incidentDate: new Date('2024-10-02T11:45:00') },
      ],
    });
    counts.trafficViolations = 6;
  } else {
    counts.trafficViolations = existingViolations;
  }

  // ─── Événements de collaboration ───
  const existingCollab = await db.collaborationEvent.count({ where: { userId } });
  if (existingCollab === 0) {
    await db.collaborationEvent.createMany({
      data: [
        { userId, triggerModule: 'security', eventType: 'geofence_exit', severity: 'warning', description: 'Le module sécurité a détecté une sortie de zone géofence. Le module assurance a été alerté pour vérification de couverture.', affectedModules: JSON.stringify(['insurance', 'fleet', 'government']), resolved: true },
        { userId, triggerModule: 'telematics', eventType: 'driving_score_drop', severity: 'info', description: 'Le score de conduite a baissé de 5 points cette semaine. Le module assurance a ajusté la prime PHYD. Le module instructeur IA a suggéré des exercices de perfectionnement.', affectedModules: JSON.stringify(['insurance', 'driving', 'government']), resolved: false },
        { userId, triggerModule: 'diagnostic', eventType: 'critical_fault', severity: 'critical', description: 'Un diagnostic critique a été détecté (freinage dégradé). Le module flotte a planifié une maintenance urgente. Le module assurance a été notifié du risque.', affectedModules: JSON.stringify(['fleet', 'insurance', 'marketplace', 'security']), resolved: false },
      ],
    });
    counts.collaborationEvents = 3;
  } else {
    counts.collaborationEvents = existingCollab;
  }

  // ─── Jumeaux numériques ───
  const existingTwins = await db.vehicleTwin.count();
  if (existingTwins === 0) {
    const vehicleProfiles = await db.vehicleProfile.findMany({ where: { userId } });
    for (const vp of vehicleProfiles) {
      const trips = await db.telematicsTrip.aggregate({
        where: { vehicleId: vp.id },
        _count: true,
        _sum: { distance: true, fuelConsumption: true },
      });
      const diagnostics = await db.diagnosticRecord.findMany({
        where: { vehicleId: vp.id },
        select: { severity: true },
      });
      const policy = await db.insurancePolicy.findFirst({
        where: { userId, status: 'active' },
      });
      const severityPenalty: Record<string, number> = { low: 2, medium: 8, high: 20, critical: 40 };
      const penalty = diagnostics.reduce((s, d) => s + (severityPenalty[d.severity] || 5), 0);

      await db.vehicleTwin.create({
        data: {
          vehicleProfileId: vp.id,
          vin: vp.vin || null,
          registration: vp.licensePlate || null,
          ownerUserId: userId,
          currentMileage: vp.mileage,
          totalTrips: trips._count || 0,
          totalDistance: trips._sum.distance || 0,
          avgFuelConsumption: (trips._sum.distance && trips._sum.fuelConsumption && trips._sum.distance > 0)
            ? Math.round((trips._sum.fuelConsumption / trips._sum.distance) * 100) / 100
            : 0,
          aiHealthScore: Math.max(0, Math.min(100, 100 - penalty)),
          insuranceStatus: policy ? policy.type : 'unknown',
          recallCount: 0,
          aiPredictions: JSON.stringify({
            prochain_entretien_km: vp.mileage + 5000,
            usure_pneus_estimée: '45%',
            durée_vie_batterie_restante: '3 ans',
          }),
        },
      });
    }
    counts.vehicleTwins = vehicleProfiles.length;
  } else {
    counts.vehicleTwins = existingTwins;
  }

  // ─── Entreprise ───
  const existingFlags = await db.featureFlag.count();
  if (existingFlags === 0) {
    await db.featureFlag.createMany({
      data: [
        { key: 'ai_instructor', name: 'Instructeur IA', description: 'Active le module d\'instruction de conduite par intelligence artificielle', enabled: true, targetRoles: 'student,instructor' },
        { key: 'fleet_optimization', name: 'Optimisation Flotte', description: 'Active les algorithmes d\'optimisation de gestion de flotte et d\'affectation des véhicules', enabled: true, targetRoles: 'enterprise_admin' },
        { key: 'insurance_phyd', name: 'Assurance PHYD', description: 'Active le calcul de prime d\'assurance basé sur le comportement de conduite (Pay-How-You-Drive)', enabled: true, targetRoles: 'student,pro,premium' },
      ],
    });
    counts.featureFlags = 3;

    await db.apiKey.create({
      data: {
        userId,
        name: 'Clé API Démo ADSO',
        key: `adso_demo_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        permissions: JSON.stringify(['read:telematics', 'read:vehicles', 'write:driving_sessions', 'read:insurance']),
      },
    });
    counts.apiKeys = 1;
  } else {
    counts.featureFlags = existingFlags;
  }

  return counts;
}

export async function POST(request: NextRequest) {
  const { error } = await requireRole('admin');
  if (error) return error;
  // ─── Auth guard: seed requires admin+ in production ───
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Endpoint désactivé en production' },
      { status: 403 },
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const action = (body as { action?: string }).action;

    if (action === 'practical') {
      const existing = await db.practicalExercise.count();
      if (existing > 0) {
        return NextResponse.json({
          seeded: true,
          message: `Exercices pratiques déjà présents (${existing})`,
          count: existing,
        });
      }

      for (const exercise of seedPracticalExercises) {
        await db.practicalExercise.create({ data: exercise });
      }

      const count = await db.practicalExercise.count();
      return NextResponse.json({
        seeded: true,
        action: 'practical',
        count,
      });
    }

    if (action === 'v42') {
      const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
      if (!user) {
        return NextResponse.json({ erreur: 'Utilisateur introuvable' }, { status: 404 });
      }
      const v42Counts = await seedV42Data(user.id);
      return NextResponse.json({
        seeded: true,
        action: 'v42',
        counts: v42Counts,
      });
    }

    // Default: seed everything
    const [existingCountries, existingLicenses, existingSigns, existingQuestions] = await Promise.all([
      db.country.count(),
      db.licenseCategory.count(),
      db.roadSign.count(),
      db.question.count(),
    ]);

    // Seed countries
    if (existingCountries === 0) {
      for (const country of seedCountries) {
        await db.country.create({ data: country });
      }
    }

    // Seed licenses
    if (existingLicenses === 0) {
      for (const license of seedLicenseCategories) {
        await db.licenseCategory.create({ data: license });
      }
    }

    // Seed signs
    if (existingSigns === 0) {
      for (const sign of seedRoadSigns) {
        await db.roadSign.create({ data: sign as Parameters<typeof db.roadSign.create>[0]['data'] });
      }
    }

    // Seed questions
    if (existingQuestions === 0) {
      for (const question of seedQuestions) {
        await db.question.create({ data: question });
      }
    }

    // Seed practical exercises
    const existingPractical = await db.practicalExercise.count();
    if (existingPractical === 0) {
      for (const exercise of seedPracticalExercises) {
        await db.practicalExercise.create({ data: exercise });
      }
    }

    // Seed V4.2 demo data
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    let v42Counts: Record<string, number> = {};
    if (user) {
      v42Counts = await seedV42Data(user.id);
    }

    const [countries, licenses, signs, questions, practical] = await Promise.all([
      db.country.count(),
      db.licenseCategory.count(),
      db.roadSign.count(),
      db.question.count(),
      db.practicalExercise.count(),
    ]);

    return NextResponse.json({
      seeded: true,
      counts: { countries, licenses, signs, questions, practical, ...v42Counts },
    });
  } catch (error) {
    console.error('[POST /api/seed] Error:', error);
    return NextResponse.json({ error: 'Seed error' }, { status: 500 });
  }
}

// GET — Return current DB counts
export async function GET() {
  const { error } = await requireRole('admin');
  if (error) return error;
  // ─── Auth guard: seed requires admin+ in production ───
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Endpoint désactivé en production' },
      { status: 403 },
    );
  }

  try {
    const [countries, licenses, signs, questions, practical, insurancePolicies, insuranceClaims, trustScores, telematicsTrips, fleetOrganizations, securityEvents, marketplaceListings, trafficViolations, collaborationEvents, vehicleTwins, featureFlags, fraudAlerts, accidentIncidents] = await Promise.all([
      db.country.count(),
      db.licenseCategory.count(),
      db.roadSign.count(),
      db.question.count(),
      db.practicalExercise.count(),
      db.insurancePolicy.count(),
      db.insuranceClaim.count(),
      db.trustScore.count(),
      db.telematicsTrip.count(),
      db.fleetOrganization.count(),
      db.securityEvent.count(),
      db.marketplaceListing.count(),
      db.trafficViolation.count(),
      db.collaborationEvent.count(),
      db.vehicleTwin.count(),
      db.featureFlag.count(),
      db.fraudAlert.count(),
      db.accidentIncident.count(),
    ]);

    return NextResponse.json({
      counts: {
        countries,
        licenses,
        signs,
        questions,
        practical,
        insurancePolicies,
        insuranceClaims,
        trustScores,
        telematicsTrips,
        fleetOrganizations,
        securityEvents,
        marketplaceListings,
        trafficViolations,
        collaborationEvents,
        vehicleTwins,
        featureFlags,
        fraudAlerts,
        accidentIncidents,
      },
    });
  } catch (error) {
    console.error('[GET /api/seed] Error:', error);
    return NextResponse.json({ error: 'Seed error' }, { status: 500 });
  }
}
