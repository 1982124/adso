import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const AFRICAN_COMMON_CATALOG = new Set([
  'DZ','AO','BJ','BW','BF','BI','CV','CM','CF','TD','KM','CG','CD','CI','DJ','EG','GQ','ER',
  'SZ','ET','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ',
  'NA','NE','NG','RW','ST','SN','SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW'
]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCountry = (searchParams.get('countryCode') || 'FR').trim().toUpperCase();
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Use a verified national bank when available. For African markets without
    // one, expose the common road-sign theory baseline rather than an empty
    // library. Local/immersive sign situations still require validation.
    where.countryCode = requestedCountry;
    let signs = await db.roadSign.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    if (signs.length === 0 && AFRICAN_COMMON_CATALOG.has(requestedCountry) && requestedCountry !== 'FR') {
      signs = await db.roadSign.findMany({
        where: { ...where, countryCode: 'FR' },
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      });
    }

    const parsed = signs.map((s) => ({
      id: s.id,
      countryCode: requestedCountry,
      category: s.category,
      subcategory: s.subcategory,
      name: s.name,
      description: s.description,
      meaning: s.meaning,
      useCase: s.useCase,
      shape: s.shape,
      colors: safeParse(s.colors),
      questions: safeParse(s.questions),
    }));

    return NextResponse.json({
      signs: parsed,
      total: parsed.length,
      contentScope: AFRICAN_COMMON_CATALOG.has(requestedCountry) ? 'africa-common-theory' : 'country-validated',
    });
  } catch (error) {
    console.error('[GET /api/learning/signs] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des panneaux' },
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
