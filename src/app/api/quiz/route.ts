import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET() {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const allQuestions = await db.question.findMany();

    if (allQuestions.length === 0) {
      return NextResponse.json({ questions: [], total: 0 });
    }

    // Randomly select up to 10 questions
    const shuffled = shuffleArray(allQuestions);
    const selected = shuffled.slice(0, 10);

    // Parse options from JSON string
    const questions = selected.map((q) => {
      let parsedOptions: string[];
      try {
        parsedOptions = JSON.parse(q.options);
      } catch {
        parsedOptions = [q.options];
      }

      return {
        id: q.id,
        question: q.question,
        options: parsedOptions,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        difficulty: q.difficulty,
        category: q.category,
      };
    });

    return NextResponse.json({
      questions,
      total: questions.length,
    });
  } catch (error) {
    console.error('[GET /api/quiz] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement du quiz' },
      { status: 500 }
    );
  }
}

interface QuizAnswer {
  questionId: string;
  selectedOption: number;
}

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;
    const userId = getUserId(session)!;

    const body = await request.json();
    const { answers, duration } = body as {
      answers: QuizAnswer[];
      duration?: number;
    };

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'Réponses requises' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Fetch all referenced questions
    const questionIds = answers.map((a) => a.questionId);
    const questions = await db.question.findMany({
      where: { id: { in: questionIds } },
    });

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    let correctAnswers = 0;
    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (question && answer.selectedOption === question.correctIndex) {
        correctAnswers++;
      }
    }

    const totalQuestions = answers.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 70;

    const attempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        totalQuestions,
        correctAnswers,
        score,
        duration: duration ?? 0,
        passed,
      },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      totalQuestions,
      correctAnswers,
      score,
      passed,
      duration: attempt.duration,
    });
  } catch (error) {
    console.error('[POST /api/quiz] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la soumission du quiz' },
      { status: 500 }
    );
  }
}
