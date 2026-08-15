import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * ADSO content applicability model:
 * - national: validated for the requested country
 * - harmonized: validated as applicable across a defined group of countries
 * - common: certified/common driving knowledge applicable broadly
 * - supplementary: useful teaching material that is not itself a legal claim
 *
 * The absence of a country-specific row never means that another country's
 * rules become that country's rules. Instead, ADSO serves the common/harmonized
 * knowledge layer until national content is available/validated.
 */
type ContentScope = 'national' | 'harmonized' | 'common' | 'supplementary';

function parseScope(value: string | null | undefined): ContentScope {
  if (value === 'national' || value === 'harmonized' || value === 'common' || value === 'supplementary') return value;
  return 'common';
}

function sanitizeCommonField(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCountry = (searchParams.get('countryCode') || 'ZZ').trim().toUpperCase();
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (search) where.OR = [{ name: { contains: search } }, { description: { contains: search } }];

    // National content is always preferred for the selected country.
    const nationalSigns = requestedCountry !== 'ZZ'
      ? await db.roadSign.findMany({
          where: { ...where, countryCode: requestedCountry },
          orderBy: [{ category: 'asc' }, { name: 'asc' }],
        })
      : [];

    let signs = nationalSigns;
    let contentScope: ContentScope = nationalSigns.length > 0 ? 'national' : 'common';

    if (signs.length === 0) {
      // The existing reference library is treated as a COMMON pedagogical
      // corpus, not as French regulation. This lets ADSO reuse internationally
      // established knowledge without falsely assigning foreign legal rules.
      signs = await db.roadSign.findMany({
        where: { ...where, countryCode: 'FR' },
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      });
    }

    const parsed = signs.map((s) => ({
      id: s.id,
      countryCode: requestedCountry,
      applicability: contentScope,
      category: s.category,
      subcategory: s.subcategory,
      name: s.name,
      description: sanitizeCommonField(s.description, `Signalisation du socle commun ADSO : ${s.name}.`),
      meaning: sanitizeCommonField(
        s.meaning,
        `Ce signal transmet un message de sécurité routière selon sa forme et son symbole. Les éventuelles prescriptions nationales complémentaires s'ajoutent à ce socle.`,
      ),
      useCase: sanitizeCommonField(
        s.useCase,
        `Support pédagogique ${contentScope}. Les dispositions nationales applicables au pays sélectionné complètent ce contenu.`,
      ),
      shape: s.shape,
      colors: safeParse(s.colors),
      questions: safeParse(s.questions),
    }));

    return NextResponse.json({
      signs: parsed,
      total: parsed.length,
      applicability: contentScope,
      requestedCountry,
      nationalContentAvailable: nationalSigns.length > 0,
    });
  } catch (error) {
    console.error('[GET /api/learning/signs] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des panneaux' }, { status: 500 });
  }
}
