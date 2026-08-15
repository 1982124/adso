import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const FOREIGN_LEGAL_MARKERS = [
  /\bFrance\b/i, /\bfrançais(?:e|es)?\b/i, /\bfrançaise(?:s)?\b/i,
  /\beuros?\b/i, /\bcode de la route français\b/i, /\bpermis à points\b/i,
  /\bcontravention\b/i, /\bpréfet\b/i, /\bETG\b/i, /\bSAMU\b/i,
  /\b130\s*km\/h\b/i, /\b110\s*km\/h\b/i, /\b80\s*km\/h\b/i,
  /\b50\s*km\/h\b/i, /\b90\s*km\/h\b/i, /\b135\s*€\b/i,
  /\bParis\b/i, /\bStrasbourg\b/i, /\bNantes\b/i, /\bBordeaux\b/i,
];

function sanitizeCommonField(value: string | null | undefined, fallback: string) {
  if (!value || FOREIGN_LEGAL_MARKERS.some((marker) => marker.test(value))) return fallback;
  return value;
}

function sanitizeSign(s: {
  id: string; countryCode: string; category: string; subcategory: string | null;
  name: string; description: string; meaning: string; useCase: string | null;
  shape: string; colors: string; questions: string | null;
}, requestedCountry: string, scope: string) {
  if (scope === 'country-validated') return {
    id: s.id, countryCode: requestedCountry, category: s.category, subcategory: s.subcategory,
    name: s.name, description: s.description, meaning: s.meaning, useCase: s.useCase,
    shape: s.shape, colors: safeParse(s.colors), questions: safeParse(s.questions),
  };
  const genericDescription = `Signalisation du socle commun ADSO : ${s.name}.`;
  const genericMeaning = `Ce signal informe, avertit, interdit, impose ou oriente selon sa forme et son symbole. Le conducteur doit l'observer, comprendre son message et adapter sa conduite en sécurité. Les prescriptions nationales sont à vérifier dans la réglementation du pays sélectionné.`;
  const genericUseCase = `Support pédagogique commun. La forme, le symbole et l'usage doivent être interprétés avec la couche de signalisation officiellement validée pour le pays sélectionné.`;
  return {
    id: s.id, countryCode: requestedCountry, category: s.category, subcategory: s.subcategory,
    name: s.name,
    description: sanitizeCommonField(s.description, genericDescription),
    meaning: sanitizeCommonField(s.meaning, genericMeaning),
    useCase: sanitizeCommonField(s.useCase, genericUseCase),
    shape: s.shape, colors: safeParse(s.colors), questions: safeParse(s.questions),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCountry = (searchParams.get('countryCode') || 'BJ').trim().toUpperCase();
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (search) where.OR = [{ name: { contains: search } }, { description: { contains: search } }];

    let signs = await db.roadSign.findMany({ where: { ...where, countryCode: requestedCountry }, orderBy: [{ category: 'asc' }, { name: 'asc' }] });
    let contentScope = 'country-validated';
    if (signs.length === 0) {
      signs = await db.roadSign.findMany({ where: { ...where, countryCode: 'FR' }, orderBy: [{ category: 'asc' }, { name: 'asc' }] });
      contentScope = 'global-common-theory';
    }

    const parsed = signs.map((s) => sanitizeSign(s, requestedCountry, contentScope));
    return NextResponse.json({ signs: parsed, total: parsed.length, contentScope, requestedCountry });
  } catch (error) {
    console.error('[GET /api/learning/signs] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des panneaux' }, { status: 500 });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}
