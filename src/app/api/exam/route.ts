import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';

interface ExamAnswer {
  questionId: string;
  selectedOption: number;
}

const EXAM_SESSION_COOKIE = 'adso_exam_session';

function randomChars(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) result += chars[bytes[i] % chars.length];
  return result;
}

function normalizeCountryCode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : null;
}

function verifyExamSession(token: string | undefined) {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret || !token) return null;
  const separator = token.lastIndexOf('.');
  if (separator <= 0) return null;
  const encoded = token.slice(0, separator);
  const providedSignature = token.slice(separator + 1);
  const expectedSignature = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  const a = Buffer.from(providedSignature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as {
      v: number;
      issuedAt: number;
      expiresAt: number;
      countryCode: string;
      contentCountry: string | null;
      contentScope: string;
      licenseCode: string | null;
      questionIds: string[];
    };
    if (payload.v !== 1 || !Array.isArray(payload.questionIds) || payload.questionIds.length === 0) return null;
    if (payload.expiresAt < Date.now() || payload.issuedAt > Date.now() + 60_000) return null;
    return payload;
  } catch {
    return null;
  }
}

async function issueExamCertificate(userId: string, score: number, countryCode: string, licenseCode: string | null) {
  const existing = await db.certification.findFirst({
    where: { userId, type: 'exam_passed', licenseCode, countryCode },
    orderBy: { issuedAt: 'desc' },
  });
  if (existing && existing.score != null && existing.score >= score) return existing;

  return db.certification.create({
    data: {
      userId,
      type: 'exam_passed',
      title: 'Certification ADSO — Maîtrise du Code de la circulation',
      description: 'Certification ADSO délivrée automatiquement après réussite d’un examen blanc supervisé par la plateforme.',
      countryCode,
      licenseCode,
      score,
      qrCode: `https://adso.verify/${randomChars(16)}`,
      certificateId: `ADSO-${randomChars(4)}-${randomChars(4)}`,
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;
    const body = await request.json();
    const { answers, type, duration, countryCode, licenseCode } = body as {
      answers: ExamAnswer[];
      type?: string;
      duration?: number;
      countryCode?: string;
      licenseCode?: string;
    };

    const normalizedCountry = normalizeCountryCode(countryCode);
    if (!normalizedCountry) {
      return NextResponse.json({ error: 'countryCode valide requis pour soumettre un examen' }, { status: 400 });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0 || answers.length > 100) {
      return NextResponse.json({ error: 'Le nombre de réponses doit être compris entre 1 et 100' }, { status: 400 });
    }

    const sessionCookie = (await cookies()).get(EXAM_SESSION_COOKIE)?.value;
    const examSession = verifyExamSession(sessionCookie);
    if (!examSession) {
      return NextResponse.json({ error: 'Session d’examen invalide ou expirée. Rechargez un nouvel examen.' }, { status: 400 });
    }
    if (examSession.countryCode !== normalizedCountry) {
      return NextResponse.json({ error: 'Le pays de la session ne correspond pas au pays de l’examen.' }, { status: 400 });
    }
    if ((examSession.licenseCode || null) !== (licenseCode || null)) {
      return NextResponse.json({ error: 'La catégorie de permis ne correspond pas à la session.' }, { status: 400 });
    }

    const sessionQuestionIds = new Set(examSession.questionIds);
    const uniqueIds = new Set<string>();
    for (const answer of answers) {
      if (!answer || typeof answer.questionId !== 'string' || !answer.questionId.trim()) {
        return NextResponse.json({ error: 'Identifiant de question invalide' }, { status: 400 });
      }
      if (!Number.isInteger(answer.selectedOption) || answer.selectedOption < 0 || answer.selectedOption > 99) {
        return NextResponse.json({ error: 'Réponse invalide' }, { status: 400 });
      }
      if (uniqueIds.has(answer.questionId)) {
        return NextResponse.json({ error: 'Une question ne peut être soumise qu’une seule fois' }, { status: 400 });
      }
      if (!sessionQuestionIds.has(answer.questionId)) {
        return NextResponse.json({ error: 'Question non délivrée par cette session d’examen' }, { status: 400 });
      }
      uniqueIds.add(answer.questionId);
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });

    const questionIds = [...uniqueIds];
    const questions = await db.question.findMany({ where: { id: { in: questionIds } } });
    if (questions.length !== questionIds.length) {
      return NextResponse.json({ error: 'Une ou plusieurs questions ne sont plus valides' }, { status: 400 });
    }

    const questionMap = new Map(questions.map((q) => [q.id, q]));
    let correctAnswers = 0;
    const wrongAnswerIds: string[] = [];

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId)!;
      let optionCount = 0;
      try { optionCount = JSON.parse(question.options).length; } catch { optionCount = 0; }
      if (optionCount > 0 && answer.selectedOption >= optionCount) {
        return NextResponse.json({ error: 'Index de réponse hors limites' }, { status: 400 });
      }
      if (answer.selectedOption === question.correctIndex) correctAnswers++;
      else wrongAnswerIds.push(answer.questionId);
    }

    const totalQuestions = answers.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 70;
    const examType = type ?? 'mock_exam';

    const attempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        totalQuestions,
        correctAnswers,
        score,
        duration: Number.isFinite(duration) && (duration ?? 0) >= 0 ? Math.min(duration ?? 0, 86400) : 0,
        passed,
        type: examType,
        country: normalizedCountry,
        licenseCode: licenseCode ?? null,
        wrongAnswers: JSON.stringify(wrongAnswerIds),
      },
    });

    let certification: Awaited<ReturnType<typeof issueExamCertificate>> | null = null;
    if (passed && examType === 'mock_exam') {
      certification = await issueExamCertificate(user.id, score, normalizedCountry, licenseCode ?? null);
    }

    const response = NextResponse.json({
      attemptId: attempt.id,
      score,
      passed,
      correctAnswers,
      totalQuestions,
      wrongAnswers: wrongAnswerIds,
      certification,
    });
    response.cookies.set(EXAM_SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/exam', maxAge: 0 });
    return response;
  } catch (error) {
    console.error('[POST /api/exam] Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la soumission de l\'examen' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limitParam = searchParams.get('limit');
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });

    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 100) : 50;
    const where: { userId: string; type?: string } = { userId: user.id };
    if (type) where.type = type;
    const attempts = await db.quizAttempt.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit });
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter((a) => a.passed).length;
    const avgScore = totalAttempts ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts) : 0;
    const passRate = totalAttempts ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
    const bestScore = totalAttempts ? Math.max(...attempts.map((a) => a.score)) : 0;

    return NextResponse.json({
      history: attempts.map((a) => ({
        id: a.id,
        totalQuestions: a.totalQuestions,
        correctAnswers: a.correctAnswers,
        score: a.score,
        duration: a.duration,
        passed: a.passed,
        type: a.type,
        country: a.country,
        licenseCode: a.licenseCode,
        wrongAnswers: safeParse(a.wrongAnswers),
        createdAt: a.createdAt,
      })),
      stats: { totalAttempts, passedAttempts, failedAttempts: totalAttempts - passedAttempts, avgScore, passRate, bestScore },
    });
  } catch (error) {
    console.error('[GET /api/exam] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement de l\'historique' }, { status: 500 });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}
