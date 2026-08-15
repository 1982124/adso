import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const LOCAL_LEGAL_MARKERS = [
  /\bfrance\b/i, /article\s+r\d/i, /\b\d+(?:[.,]\d+)?\s*g\/l\b/i,
  /\b\d+\s*km\/h\b/i, /\b\d+\s*points?\b/i, /permis\s+probatoire/i,
  /sam[u]?/i, /etg/i, /num[eé]ro\s+d['’]?urgence/i,
  /amende|contravention|retrait de points|suspension du permis/i,
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function isCommonTheoryQuestion(q: { question: string; explanation: string; options: string }) {
  return !LOCAL_LEGAL_MARKERS.some((marker) => marker.test(`${q.question} ${q.explanation} ${q.options}`));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const countParam = searchParams.get('count');
    const licenseCode = searchParams.get('licenseCode');
    const countryCode = (searchParams.get('countryCode') || 'BJ').trim().toUpperCase();
    const excludeParam = searchParams.get('exclude');
    const count = countParam ? Math.min(Math.max(parseInt(countParam, 10), 1), 100) : 10;
    const excludeIds = excludeParam ? excludeParam.split(',').map((id) => id.trim()).filter(Boolean) : [];

    const baseWhere: Record<string, unknown> = {};
    if (category) baseWhere.category = category;
    if (difficulty) baseWhere.difficulty = difficulty;
    if (licenseCode) baseWhere.licenseCode = licenseCode;
    if (excludeIds.length > 0) baseWhere.id = { notIn: excludeIds };

    let questions = await db.question.findMany({ where: { ...baseWhere, countryCode }, orderBy: { createdAt: 'asc' } });
    let contentScope = 'country-validated';

    if (questions.length === 0) {
      const referenceQuestions = await db.question.findMany({ where: { ...baseWhere, countryCode: 'FR' }, orderBy: { createdAt: 'asc' } });
      questions = referenceQuestions.filter(isCommonTheoryQuestion);
      contentScope = 'global-common-theory';
    }

    const selected = shuffleArray(questions).slice(0, count);
    const parsed = selected.map((q) => {
      let parsedOptions: string[];
      try { parsedOptions = JSON.parse(q.options); } catch { parsedOptions = [q.options]; }
      return {
        id: q.id, countryCode, licenseCode: q.licenseCode, question: q.question,
        options: parsedOptions, correctIndex: q.correctIndex, explanation: q.explanation,
        difficulty: q.difficulty, category: q.category, theme: q.theme,
        tags: safeParse(q.tags), reference: q.reference, hasImage: q.hasImage,
      };
    });

    return NextResponse.json({ questions: parsed, total: parsed.length, contentScope, requestedCountry: countryCode });
  } catch (error) {
    console.error('[GET /api/learning/questions] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des questions' }, { status: 500 });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}
