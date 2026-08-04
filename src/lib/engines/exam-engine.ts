// ═════════════════════════════════════════════════════════════════════════════════════════════════════════
// ADSO — Exam Engine
// Exam management, timer, pass/fail criteria, and session management.
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

import type {
  ExamSession,
  ExamResult,
  ExamConfig,
  ExamType,
  TimerController,
  QuestionData,
  ErrorAnalysisItem,
  ExamHistorySummary,
} from './types';
import { ExamType as ExamTypeEnum } from './types';
import { calculateScore, getWrongCategories } from './quiz-engine';

/**
 * Parse a JSON string into a typed array.
 * Falls back to an empty array if the value is invalid or null.
 */
function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/**
 * Default exam configurations by type.
 */
const EXAM_CONFIGS: Record<ExamType, ExamConfig> = {
  [ExamTypeEnum.Practice]: {
    type: ExamTypeEnum.Practice,
    questionCount: 10,
    timeLimit: 600,
    passThreshold: 70,
    allowReview: true,
    shuffleOptions: true,
    adaptiveDifficulty: false,
  },
  [ExamTypeEnum.MockExam]: {
    type: ExamTypeEnum.MockExam,
    questionCount: 40,
    timeLimit: 1800,
    passThreshold: 80,
    allowReview: false,
    shuffleOptions: true,
    adaptiveDifficulty: false,
  },
  [ExamTypeEnum.Official]: {
    type: ExamTypeEnum.Official,
    questionCount: 40,
    timeLimit: 1800,
    passThreshold: 80,
    allowReview: false,
    shuffleOptions: true,
    adaptiveDifficulty: false,
  },
  [ExamTypeEnum.Adaptive]: {
    type: ExamTypeEnum.Adaptive,
    questionCount: 20,
    timeLimit: 900,
    passThreshold: 75,
    allowReview: true,
    shuffleOptions: true,
    adaptiveDifficulty: true,
  },
};

/**
 * Get the exam configuration for a given type.
 * @param type - The exam type
 * @returns Configuration object for that exam type
 */
export function getExamConfig(type: ExamType): ExamConfig {
  return EXAM_CONFIGS[type] ?? EXAM_CONFIGS[ExamTypeEnum.Practice];
}

/**
 * Create a new exam session with the given configuration.
 * Initializes the session with the provided questions and null answers.
 * @param config - Object containing session parameters
 * @returns A new ExamSession object
 */
export function createExamSession(config: {
  id: string;
  type: ExamType;
  country: string;
  licenseCode: string;
  questions: QuestionData[];
  duration?: number;
}): ExamSession {
  const examConfig = getExamConfig(config.type);
  return {
    id: config.id,
    type: config.type,
    country: config.country,
    licenseCode: config.licenseCode,
    questions: config.questions,
    answers: new Array(config.questions.length).fill(null),
    score: null,
    passed: null,
    duration: config.duration ?? examConfig.timeLimit,
    startedAt: new Date(),
    completedAt: null,
  };
}

/**
 * Start a countdown timer for an exam.
 * Returns a TimerController that can be started, paused, resumed, and stopped.
 * Uses `setInterval` internally; callers must call `stop()` to clean up.
 * @param duration - Total duration in seconds
 * @returns Timer controller object
 */
export function startTimer(duration: number): TimerController {
  let elapsed = 0;
  let remaining = duration;
  let running = false;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const tickCallbacks: Array<(elapsed: number, remaining: number) => void> = [];
  const completeCallbacks: Array<() => void> = [];

  const tick = () => {
    elapsed++;
    remaining = Math.max(0, duration - elapsed);
    for (const cb of tickCallbacks) cb(elapsed, remaining);

    if (remaining <= 0) {
      stop();
      for (const cb of completeCallbacks) cb();
    }
  };

  const controller: TimerController = {
    get elapsed() {
      return elapsed;
    },
    get remaining() {
      return remaining;
    },
    get isRunning() {
      return running;
    },
    start() {
      if (running) return;
      running = true;
      intervalId = setInterval(tick, 1000);
    },
    pause() {
      if (!running) return;
      running = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
    resume() {
      if (running || remaining <= 0) return;
      running = true;
      intervalId = setInterval(tick, 1000);
    },
    stop() {
      running = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
    onTick(callback: (elapsed: number, remaining: number) => void) {
      tickCallbacks.push(callback);
    },
    onComplete(callback: () => void) {
      completeCallbacks.push(callback);
    },
  };

  return controller;
}

/**
 * Submit an exam session and calculate the results.
 * Sets score, passed status, and completion time on the session.
 * @param session - The active exam session
 * @param answers - Array of selected option indices (null for unanswered)
 * @param questions - The questions for this exam
 * @returns ExamResult with detailed scoring
 */
export function submitExam(
  session: ExamSession,
  answers: (number | null)[],
  questions: QuestionData[]
): ExamResult {
  const { correct, total, percentage } = calculateScore(answers, questions);
  const examConfig = getExamConfig(session.type);
  const passed = percentage >= examConfig.passThreshold;

  // Update session
  session.answers = answers;
  session.score = percentage;
  session.passed = passed;
  session.completedAt = new Date();

  // Collect wrong answer IDs
  const wrongAnswers: string[] = [];
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] !== null && answers[i] !== questions[i].correctIndex) {
      wrongAnswers.push(questions[i].id);
    }
  }

  return {
    examId: session.id,
    score: percentage,
    passed,
    correctAnswers: correct,
    totalQuestions: total,
    duration: session.duration,
    wrongAnswers,
    wrongCategories: getWrongCategories(answers, questions),
  };
}

/**
 * Calculate the pass score threshold for a given exam type and country.
 * Some countries have specific pass requirements (e.g., France requires 35/40).
 * @param type - The exam type
 * @param _country - Country code (reserved for future country-specific thresholds)
 * @returns Pass percentage threshold
 */
export function calculatePassScore(type: ExamType, _country: string = 'FR'): number {
  const config = getExamConfig(type);
  // France-specific: 35/40 = 87.5% for official exams
  if (_country.toUpperCase() === 'FR' && type === ExamTypeEnum.Official) {
    return Math.round((35 / 40) * 100);
  }
  return config.passThreshold;
}

/**
 * Format a duration in seconds as MM:SS.
 * @param seconds - Duration in seconds
 * @returns Formatted time string (e.g., "05:30")
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Calculate the estimated average time to answer a question.
 * @param questions - Array of questions
 * @returns Average time per question in seconds
 */
export function calculateAverageTime(questions: QuestionData[]): number {
  if (questions.length === 0) return 0;
  // Estimated: 30 seconds for easy, 45 for medium, 60 for hard
  const timeMap: Record<string, number> = {
    easy: 30,
    medium: 45,
    hard: 60,
  };
  const totalTime = questions.reduce(
    (sum, q) => sum + (timeMap[q.difficulty] ?? 45),
    0
  );
  return Math.round(totalTime / questions.length);
}

/**
 * Generate a detailed error analysis from wrong answers.
 * Groups wrong answers by category with counts and percentages.
 * @param wrongAnswers - Array of question IDs that were answered incorrectly
 * @param questions - All questions for the exam
 * @returns Array of error analysis items sorted by count descending
 */
export function getErrorAnalysis(
  wrongAnswers: string[],
  questions: QuestionData[]
): ErrorAnalysisItem[] {
  if (wrongAnswers.length === 0) return [];

  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const categoryMap = new Map<string, string[]>();

  for (const qId of wrongAnswers) {
    const q = questionMap.get(qId);
    if (!q) continue;
    const existing = categoryMap.get(q.category) ?? [];
    existing.push(qId);
    categoryMap.set(q.category, existing);
  }

  return Array.from(categoryMap.entries())
    .map(([category, ids]) => ({
      category,
      count: ids.length,
      percentage: Math.round((ids.length / wrongAnswers.length) * 100),
      questionIds: ids,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generate a summary from exam attempt history.
 * @param attempts - Array of past exam attempts with scores
 * @returns Aggregated exam history summary
 */
export function getExamHistory(
  attempts: Array<{
    score: number;
    passed: boolean;
    duration: number;
    createdAt: Date | string;
  }>
): ExamHistorySummary {
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      passedCount: 0,
      failedCount: 0,
      passRate: 0,
      avgScore: 0,
      bestScore: 0,
      avgDuration: 0,
      lastAttemptDate: null,
      improvement: 0,
    };
  }

  const scores = attempts.map((a) => a.score);
  const passedCount = attempts.filter((a) => a.passed).length;
  const totalDuration = attempts.reduce((sum, a) => sum + a.duration, 0);

  // Calculate improvement: compare last 3 attempts average to first 3 attempts average
  let improvement = 0;
  if (attempts.length >= 2) {
    const firstBatch = attempts.slice(0, Math.min(3, Math.floor(attempts.length / 2)));
    const lastBatch = attempts.slice(-Math.min(3, Math.floor(attempts.length / 2)));
    const firstAvg = firstBatch.reduce((s, a) => s + a.score, 0) / firstBatch.length;
    const lastAvg = lastBatch.reduce((s, a) => s + a.score, 0) / lastBatch.length;
    improvement = Math.round(lastAvg - firstAvg);
  }

  const sortedByDate = [...attempts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    totalAttempts: attempts.length,
    passedCount,
    failedCount: attempts.length - passedCount,
    passRate: Math.round((passedCount / attempts.length) * 100),
    avgScore: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
    bestScore: Math.max(...scores),
    avgDuration: Math.round(totalDuration / attempts.length),
    lastAttemptDate: sortedByDate[0] ? new Date(sortedByDate[0].createdAt) : null,
    improvement,
  };
}
