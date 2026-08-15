import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const AFRICAN_COMMON_CATALOG = new Set([
  'DZ','AO','BJ','BW','BF','BI','CV','CM','CF','TD','KM','CG','CD','CI','DJ','EG','GQ','ER',
  'SZ','ET','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ',
  'NA','NE','NG','RW','ST','SN','SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW'
]);

const FOREIGN_LEGAL_MARKERS = [
  /\bFrance\b/i, /\bfrançais(?:e|es)?\b/i, /\bfrançaise(?:s)?\b/i,
  /\beuros?\b/i, /\bcode de la route français\b/i,
  /\bpermis à points\b/i, /\bpoints? de permis\b/i,
  /\bcontravention\b/i, /\bpréfet\b/i, /\bETG\b/i,
  /\bSAMU\b/i, /\bpermis probatoire\b/i,
  /\b130\s*km\/h\b/i, /\b110\s*km\/h\b/i, /\b80\s*km\/h\b/i,
  /\b50\s*km\/h\b/i, /\b90\s*km\/h\b/i,
  /\b135\s*€\b/i, /\b4\s*points?\b/i,
  /\bParis\b/i, /\bStrasbourg\b/i, /\bNantes\b/i, /\bBordeaux\b/i,
  /\bdans l'Est et le Centre de la France\b/i,
];

function sanitizeCommonField(value: string | null | undefined, fallback: string) {
  if (!value || FOREIGN_LEGAL_MARKERS.some((marker) => marker.test(value))) return fallback;
  return value;
}

function sanitizeSign(s: {
  id: string; countryCode: string; category: string; subcategory: string | null;
  name: string; description: string; meaning: string; useCase: string | null;
  shape: string; colors: string; questions: string | null;
}, requestedCountry: string) {
  const common = AFRICAN_COMMON_CATALOG.has(requestedCountry);
  if (!common) return {
    id: s.id, countryCode: requestedCountry, category: s.category, subcategory: s.subcategory,
    name: s.name, description: s.description, meaning: s.meaning, useCase: s.useCase,
    shape: s.shape, colors: safeParse(s.colors), questions: safeParse(s.questions),
  };

  const genericDescription = `Signalisation du socle commun de conduite et de mobilité : ${s.name}.`;
  const genericMeaning = `Ce signal informe, avertit, interdit, impose ou oriente selon sa forme et son symbole. Le conducteur doit l'observer, comprendre son message et adapter sa conduite en sécurité. Les prescriptions chiffrées, sanctions et particularités administratives sont traitées séparément dans la réglementation nationale.`;
  const genericUseCase = `Présent lorsqu'une situation de circulation nécessite ce type d'information, d'avertissement, d'interdiction, d'obligation ou d'orientation. La localisation exacte et les compléments réglementaires dépendent de la signalisation en vigueur dans le pays sélectionné.`;

  return {
    id: s.id,
    countryCode: requestedCountry,
    category: s.category,
    subcategory: s.subcategory,
    name: s.name,
    description: sanitizeCommonField(s.description, genericDescription),
    meaning: sanitizeCommonField(s.meaning, genericMeaning),
    useCase: sanitizeCommonField(s.useCase, genericUseCase),
    shape: s.shape,
    colors: safeParse(s.colors),
    questions: safeParse(s.questions),
  };
}

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

    const parsed = signs.map((s) => sanitizeSign(s, requestedCountry));

    return NextResponse.json({
      signs: parsed,
      total: parsed.length,
      contentScope: AFRICAN_COMMON_CATALOG.has(requestedCountry) ? 'africa-common-theory' : 'country-validated',
    });
  } catch (error) {
    console.error('[GET /api/learning/signs] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des panneaux' }, { status: 500 });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}
