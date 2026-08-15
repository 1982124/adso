import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type ContentScope = 'national' | 'harmonized' | 'common' | 'supplementary';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function isLikelyCommonTheory(q: { question: string; explanation: string; options: string; reference: string | null }) {
  // This is a conservative compatibility filter for the legacy reference bank.
  // It prevents clearly jurisdiction-specific wording from being presented as
  // universal, while allowing genuinely common road-safety knowledge through.
  const text = `${q.question} ${q.explanation} ${q.options} ${q.reference ?? ''}`.toLowerCase();
  const jurisdictionMarkers = [
    'france', 'français', 'française', 'euro', 'article r', 'permis à points',
    'préfet', 'etg', 'samu', 'paris', 'contravention', 'retrait de points',
  ];
  return !jurisdictionMarkers.some((marker) => text.includes(marker));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const countParam = searchParams.get('count');
    const licenseCode = searchParams.get('licenseCode');
    const requestedCountry = (searchParams.get('countryCode') || 'ZZ').trim().toUpperCase();
    const excludeParam = searchParams.get('exclude');
    const count = countParam ? Math.min(Math.max(parseInt(countParam, 10), 1), 100) : 10;
    const excludeIds = excludeParam ? excludeParam.split(',').map((id) => id.trim()).filter(Boolean) : [];

    const baseWhere: Record<string, unknown> = {};
    if (category) baseWhere.category = category;
    if (difficulty) baseWhere.difficulty = difficulty;
    if (licenseCode) baseWhere.licenseCode = licenseCode;
    if (excludeIds.length > 0) baseWhere.id = { notIn: excludeIds };

    // Country-specific content is always preferred.
    let questions = requestedCountry !== 'ZZ'
      ? await db.question.findMany({
          where: { ...baseWhere, countryCode: requestedCountry },
          orderBy: { createdAt: 'asc' },
        })
      : [];

    let contentScope: ContentScope = questions.length > 0 ? 'national' : 'common';
    let contentCountry: string | null = questions.length > 0 ? requestedCountry : null;

    // The existing reference bank is not assumed to be French law. Until each
    // item is classified, reuse only questions that are clearly common safety
    // knowledge. They remain common content rather than being relabeled for the
    // selected country.
    if (questions.length === 0) {
      const referenceQuestions = await db.question.findMany({
        where: { ...baseWhere, countryCode: 'FR' },
        orderBy: { createdAt: 'asc' },
      });
      questions = referenceQuestions.filter(isLikelyCommonTheory);
      contentScope = 'common';
      contentCountry = null;
    }

    const selected = shuffleArray(questions).slice(0, count);
    const parsed = selected.map((q) => {
      let parsedOptions: string[];
      try { parsedOptions = JSON.parse(q.options); } catch { parsedOptions = [q.options]; }
      return {
        id: q.id,
        countryCode: contentCountry,
        applicability: contentScope,
        licenseCode: q.licenseCode,
        question: q.question,
        options: parsedOptions,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        difficulty: q.difficulty,
        category: q.category,
        theme: q.theme,
        tags: safeParse(q.tags),
        reference: q.reference,
        hasImage: q.hasImage,
      };
    });

    return NextResponse.json({
      questions: parsed,
      total: parsed.length,
      applicability: contentScope,
      requestedCountry,
      contentCountry,
      nationalContentAvailable: requestedCountry !== 'ZZ' && contentCountry === requestedCountry,
      disclaimer: contentScope === 'common'
        ? 'Contenu issu du socle commun de sécurité routière. Les règles nationales complémentaires s\'appliquent au pays sélectionné.'
        : null,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[GET /api/learning/questions] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des questions' }, { status: 500 });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}
