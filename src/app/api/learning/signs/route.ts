import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedRoadSigns } from '../../../../../seed-data/seed-signs';

function parseSign(sign: typeof seedRoadSigns[number], index: number) {
  return {
    id: `FR-${index + 1}`,
    countryCode: sign.countryCode,
    category: sign.category,
    subcategory: sign.subcategory,
    name: sign.name,
    description: sign.description,
    meaning: sign.meaning,
    useCase: sign.useCase,
    shape: sign.shape,
    colors: safeParse(sign.colors),
    questions: safeParse(sign.questions),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get('countryCode')?.trim().toUpperCase() || 'FR';
  const category = searchParams.get('category')?.trim() || null;
  const search = searchParams.get('search')?.trim().toLowerCase() || null;

  try {
    const where: Record<string, unknown> = { countryCode };
    if (category) where.category = category;
    if (search) where.OR = [{ name: { contains: search } }, { description: { contains: search } }];

    const signs = await db.roadSign.findMany({ where, orderBy: [{ category: 'asc' }, { name: 'asc' }] });
    const parsed = signs.map((s) => ({
      id: s.id, countryCode: s.countryCode, category: s.category, subcategory: s.subcategory,
      name: s.name, description: s.description, meaning: s.meaning, useCase: s.useCase,
      shape: s.shape, colors: safeParse(s.colors), questions: safeParse(s.questions),
    }));
    if (parsed.length > 0) return NextResponse.json({ signs: parsed, total: parsed.length, source: 'database' });
  } catch (error) {
    console.error('[GET /api/learning/signs] Database unavailable; using bundled signs:', error);
  }

  const staticSigns = seedRoadSigns
    .map(parseSign)
    .filter((sign) => sign.countryCode === countryCode)
    .filter((sign) => !category || sign.category === category)
    .filter((sign) => !search || `${sign.name} ${sign.description} ${sign.meaning}`.toLowerCase().includes(search));

  return NextResponse.json({ signs: staticSigns, total: staticSigns.length, source: 'catalogue' }, { headers: { 'X-ADSO-Data-Source': 'bundled-catalogue' } });
}

function safeParse(value: string | null): unknown {
  if (!value) return value;
  try { return JSON.parse(value); } catch { return value; }
}
