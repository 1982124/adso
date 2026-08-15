import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const AFRICAN_COMMON_CATALOG = new Set([
  'DZ','AO','BJ','BW','BF','BI','CV','CM','CF','TD','KM','CG','CD','CI','DJ','EG','GQ','ER',
  'SZ','ET','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ',
  'NA','NE','NG','RW','ST','SN','SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW'
]);

// Questions that depend on a national statute, exact legal threshold, national
// emergency number, administrative procedure or country-specific article must
// not be silently reused as an African-wide theory question.
const LOCAL_LEGAL_MARKERS = [
  /\bfrance\b/i,
  /article\s+r\d/i,
  /\b\d+(?:[.,]\d+)?\s*g\/l\b/i,
  /\b\d+\s*km\/h\b/i,
  /\b\d+\s*points?\b/i,
  /permis\s+probatoire/i,
  /sam[u]?/i,
  /etg/i,
  /num[eé]ro\s+d['’]?urgence/i,
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
  const haystack = `${q.question} ${q.explanation} ${q.options}`;
  return !LOCAL_LEGAL_MARKERS.some((marker) => marker.test(haystack));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const countParam = searchParams.get('count');
    const licenseCode = searchParams.get('licenseCode');
    const countryCode = (searchParams.get('countryCode') || 'FR').trim().toUpperCase();
    const excludeParam = searchParams.get('exclude');

    const count = countParam ? parseInt(countParam, 10) : 10;
    const excludeIds = excludeParam
      ? excludeParam.split(',').map((id) => id.trim()).filter(Boolean)
      : [];

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (licenseCode) where.licenseCode = licenseCode;
    if (excludeIds.length > 0) where.id = { notIn: excludeIds };

    // Prefer a separately validated national question bank when one exists.
    // Otherwise African markets use only the common theory subset from the
    // reference French/Vienna-aligned bank; national legal questions are excluded.
    if (!AFRICAN_COMMON_CATALOG.has(countryCode) || countryCode === 'FR') {
      where.countryCode = countryCode;
    }

    let questions = await db.question.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    if (AFRICAN_COMMON_CATALOG.has(countryCode) && countryCode !== 'FR' && questions.length === 0) {
      const referenceQuestions = await db.question.findMany({
        where: { ...where, countryCode: 'FR' },
        orderBy: { createdAt: 'asc' },
      });
      questions = referenceQuestions.filter(isCommonTheoryQuestion);
    }

    const shuffled = shuffleArray(questions);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    const parsed = selected.map((q) => {
      let parsedOptions: string[];
      try {
        parsedOptions = JSON.parse(q.options);
      } catch {
        parsedOptions = [q.options];
      }

      return {
        id: q.id,
        countryCode,
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
      contentScope: AFRICAN_COMMON_CATALOG.has(countryCode) ? 'africa-common-theory' : 'country-validated',
    });
  } catch (error) {
    console.error('[GET /api/learning/questions] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des questions' },
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
