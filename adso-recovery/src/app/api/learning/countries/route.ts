import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const continent = searchParams.get('continent');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (continent) {
      where.continent = continent;
    }

    if (search) {
      where.name = { contains: search };
    }

    const countries = await db.country.findMany({
      where,
      orderBy: [{ continent: 'asc' }, { name: 'asc' }],
    });

    // Parse JSON fields for each country
    const parsed = countries.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      flag: c.flag,
      continent: c.continent,
      capital: c.capital,
      languages: safeParse(c.languages),
      currency: safeParse(c.currency),
      drivingSide: c.drivingSide,
      authority: c.authority,
      emergencyPhone: c.emergencyPhone,
      minAge: c.minAge,
      speedUrban: c.speedUrban,
      speedRural: c.speedRural,
      speedHighway: c.speedHighway,
      bloodAlcohol: c.bloodAlcohol,
      requiredDocuments: safeParse(c.requiredDocuments),
      requiredEquipment: safeParse(c.requiredEquipment),
      specialFeatures: safeParse(c.specialFeatures),
      licenseCategories: safeParse(c.licenseCategories),
      commonInfractions: safeParse(c.commonInfractions),
      sanctions: safeParse(c.sanctions),
    }));

    return NextResponse.json({
      countries: parsed,
      total: parsed.length,
    });
  } catch (error) {
    console.error('[GET /api/learning/countries] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des pays' },
      { status: 500 }
    );
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
