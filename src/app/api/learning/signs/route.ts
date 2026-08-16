import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type ContentScope = 'national' | 'harmonized' | 'common' | 'supplementary';

function sanitizeCommonField(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}

/**
 * ADSO sign catalogue policy:
 * - national rows are preferred and explicitly identified;
 * - common/harmonized knowledge remains available even when a country has
 *   national rows, so a partial national dataset can never make the catalogue
 *   look artificially complete;
 * - foreign rows are never relabelled as national rules.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCountry = (searchParams.get('countryCode') || 'ZZ').trim().toUpperCase();
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const baseWhere: Record<string, unknown> = {};
    if (category) baseWhere.category = category;
    if (search) baseWhere.OR = [{ name: { contains: search } }, { description: { contains: search } }];

    const nationalSigns = requestedCountry !== 'ZZ'
      ? await db.roadSign.findMany({
          where: { ...baseWhere, countryCode: requestedCountry },
          orderBy: [{ category: 'asc' }, { name: 'asc' }],
        })
      : [];

    // FR is the current curated reference corpus. It is exposed as COMMON
    // pedagogical knowledge when it is not the requested country.
    const commonSigns = await db.roadSign.findMany({
      where: { ...baseWhere, countryCode: 'FR' },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    const seen = new Set<string>();
    const rows = [
      ...nationalSigns.map((s) => ({ sign: s, applicability: 'national' as ContentScope })),
      ...commonSigns.map((s) => ({ sign: s, applicability: requestedCountry === 'FR' ? 'national' as ContentScope : 'common' as ContentScope })),
    ].filter(({ sign, applicability }) => {
      const key = `${applicability}:${sign.countryCode}:${sign.name.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const parsed = rows.map(({ sign: s, applicability }) => ({
      id: `${applicability}:${s.id}`,
      sourceId: s.id,
      countryCode: requestedCountry,
      sourceCountryCode: s.countryCode,
      applicability,
      category: s.category,
      subcategory: s.subcategory,
      name: s.name,
      description: sanitizeCommonField(s.description, `Signalisation du socle ADSO : ${s.name}.`),
      meaning: sanitizeCommonField(s.meaning, 'Ce signal transmet un message de sécurité routière selon sa forme et son symbole.'),
      useCase: sanitizeCommonField(s.useCase, 'Support pédagogique ADSO ; les prescriptions nationales applicables complètent ce contenu.'),
      shape: s.shape,
      colors: safeParse(s.colors),
      questions: safeParse(s.questions),
    }));

    const categories = parsed.reduce<Record<string, number>>((acc, sign) => {
      acc[sign.category] = (acc[sign.category] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      signs: parsed,
      total: parsed.length,
      nationalCount: nationalSigns.length,
      commonCount: parsed.filter((s) => s.applicability === 'common').length,
      nationalContentAvailable: nationalSigns.length > 0,
      categories,
      requestedCountry,
      applicability: nationalSigns.length > 0 ? 'national+common' : 'common',
    });
  } catch (error) {
    console.error('[GET /api/learning/signs] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des panneaux' }, { status: 500 });
  }
}
