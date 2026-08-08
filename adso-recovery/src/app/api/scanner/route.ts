import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

// ═══════════════════════════════════════════════════════════
// Simulated sensor data ranges
// ═══════════════════════════════════════════════════════════

function randomInRange(min: number, max: number, decimals = 0): number {
  const val = min + Math.random() * (max - min);
  return decimals > 0 ? Math.round(val * 10 ** decimals) / 10 ** decimals : Math.round(val);
}

// POST /api/scanner/connect — Simulated connection
export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { action } = body;

    if (action === 'connect') {
      // Simulate a 2-second delay is handled client-side, here we just return success
      return NextResponse.json({
        status: 'connected',
        protocol: 'ISO 15765-4 (CAN)',
        ecuVersion: 'v4.2.1',
        vin: 'VF3LBHRT0K5012345',
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'readDtc') {
      const DTC_CODES = [
        { code: 'P0300', description: 'Ratés d\'allumage détectés (cylindres multiples)', severity: 'high' },
        { code: 'P0171', description: 'Système trop pauvre (Banque 1)', severity: 'medium' },
        { code: 'P0420', description: 'Efficacité du catalyseur sous le seuil (Banque 1)', severity: 'medium' },
        { code: 'P0128', description: 'Température du liquide de refroidissement sous le seuil', severity: 'medium' },
        { code: 'P0442', description: 'Fuite détectée dans le système EVAP (petite)', severity: 'low' },
        { code: 'P0135', description: 'Circuit de chauffage capteur O2 (Banque 1, Sond 1)', severity: 'medium' },
        { code: 'P0401', description: 'Débit d\'EGR insuffisant détecté', severity: 'low' },
        { code: 'P0700', description: 'Système de commande de transmission', severity: 'high' },
        { code: 'P0562', description: 'Tension du système basse', severity: 'medium' },
        { code: 'P0101', description: 'Plage/performance du débitmètre MAF', severity: 'medium' },
        { code: 'P0301', description: 'Raté d\'allumage détecté - Cylindre 1', severity: 'high' },
        { code: 'P0455', description: 'Fuite détectée dans le système EVAP (grosse)', severity: 'medium' },
        { code: 'P0500', description: 'Capteur de vitesse du véhicule défectueux', severity: 'high' },
        { code: 'P0480', description: 'Circuit de commande du ventilateur 1', severity: 'medium' },
        { code: 'P0172', description: 'Système trop riche (Banque 1)', severity: 'medium' },
        { code: 'P0174', description: 'Système trop pauvre (Banque 2)', severity: 'medium' },
        { code: 'P0302', description: 'Raté d\'allumage détecté - Cylindre 2', severity: 'high' },
        { code: 'P0303', description: 'Raté d\'allumage détecté - Cylindre 3', severity: 'high' },
        { code: 'P0304', description: 'Raté d\'allumage détecté - Cylindre 4', severity: 'high' },
        { code: 'P0131', description: 'Tension basse du capteur O2 (Banque 1, Sond 1)', severity: 'medium' },
        { code: 'P0410', description: 'Système d\'injection d\'air secondaire défectueux', severity: 'low' },
        { code: 'P0715', description: 'Circuit du capteur de vitesse turbine/entrée', severity: 'high' },
        { code: 'P0113', description: 'Tension élevée du capteur de température air admission', severity: 'low' },
      ];

      // Return 3-6 random codes
      const count = 3 + Math.floor(Math.random() * 4);
      const shuffled = [...DTC_CODES].sort(() => Math.random() - 0.5);
      return NextResponse.json({ codes: shuffled.slice(0, count) });
    }

    if (action === 'clearDtc') {
      return NextResponse.json({ success: true, message: 'Codes effaces avec succes' });
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// GET /api/scanner/data — Return simulated sensor data
export async function GET() {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const data = {
      speed: randomInRange(0, 130),
      rpm: randomInRange(800, 3500),
      engineTemp: randomInRange(80, 100, 1),
      intakeTemp: randomInRange(18, 35, 1),
      fuelPressure: randomInRange(250, 380),
      maf: randomInRange(3, 12, 1),
      batteryVoltage: randomInRange(12.5, 14.2, 1),
      consumption: randomInRange(4, 10, 1),
      oilPressure: randomInRange(150, 450),
      engineLoad: randomInRange(15, 75),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
