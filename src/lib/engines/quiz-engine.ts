// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// ADSO — Quiz Engine
// Quiz logic, scoring, adaptive difficulty, and question selection.
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

import type { QuestionData, ShuffledQuestion } from './types';

/**
 * Parse a JSON string field from question data into a typed array.
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
 * Parse the options JSON string from a question into a string array.
 * Falls back to an empty array if invalid.
 */
function parseOptions(question: QuestionData): string[] {
  try {
    const parsed = JSON.parse(question.options);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/**
 * Fisher-Yates shuffle algorithm for arrays.
 * Returns a new array; does not mutate the input.
 * @param array - Array to shuffle
 * @returns New shuffled array
 */
function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Select a random subset of questions using Fisher-Yates shuffle.
 * @param questions - Pool of questions to select from
 * @param count - Number of questions to select
 * @returns Randomly selected questions (clamped to pool size)
 */
export function selectRandomQuestions(
  questions: QuestionData[],
  count: number
): QuestionData[] {
  const clamped = Math.min(count, questions.length);
  return fisherYatesShuffle(questions).slice(0, clamped);
}

/**
 * Select questions filtered by difficulty level, then randomly from the filtered set.
 * @param questions - Pool of questions
 * @param difficulty - Difficulty to filter by ('easy', 'medium', 'hard')
 * @param count - Number of questions to select
 * @returns Randomly selected questions of the given difficulty
 */
export function selectByDifficulty(
  questions: QuestionData[],
  difficulty: string,
  count: number
): QuestionData[] {
  const filtered = questions.filter(
    (q) => q.difficulty.toLowerCase() === difficulty.trim().toLowerCase()
  );
  return selectRandomQuestions(filtered, count);
}

/**
 * Select questions filtered by theme or category, then randomly from the filtered set.
 * Checks both `theme` and `category` fields for a match.
 * @param questions - Pool of questions
 * @param category - Category or theme to filter by
 * @param count - Number of questions to select
 * @returns Randomly selected questions matching the category/theme
 */
export function selectByCategory(
  questions: QuestionData[],
  category: string,
  count: number
): QuestionData[] {
  const normalized = category.trim().toLowerCase();
  const filtered = questions.filter(
    (q) =>
      q.category.toLowerCase() === normalized ||
      (q.theme && q.theme.toLowerCase() === normalized)
  );
  return selectRandomQuestions(filtered, count);
}

/**
 * Select questions adaptively, prioritizing questions from the user's weak areas.
 * Weak area questions make up ~70% of the selection; the rest is random.
 * @param questions - Pool of questions
 * @param weakAreas - Array of weak category/theme names
 * @param count - Number of questions to select
 * @returns Adaptively selected questions
 */
export function selectAdaptive(
  questions: QuestionData[],
  weakAreas: string[],
  count: number
): QuestionData[] {
  if (weakAreas.length === 0) {
    return selectRandomQuestions(questions, count);
  }

  const weakSet = new Set(weakAreas.map((a) => a.toLowerCase()));
  const weakQuestions = questions.filter(
    (q) =>
      weakSet.has(q.category.toLowerCase()) ||
      (q.theme && weakSet.has(q.theme.toLowerCase()))
  );

  const otherQuestions = questions.filter(
    (q) =>
      !weakSet.has(q.category.toLowerCase()) &&
      !(q.theme && weakSet.has(q.theme.toLowerCase()))
  );

  const weakCount = Math.min(
    Math.ceil(count * 0.7),
    weakQuestions.length
  );
  const otherCount = Math.min(count - weakCount, otherQuestions.length);

  const selected = [
    ...selectRandomQuestions(weakQuestions, weakCount),
    ...selectRandomQuestions(otherQuestions, otherCount),
  ];

  // Fill remaining if not enough questions
  if (selected.length < count) {
    const selectedIds = new Set(selected.map((q) => q.id));
    const remaining = questions.filter((q) => !selectedIds.has(q.id));
    selected.push(...selectRandomQuestions(remaining, count - selected.length));
  }

  return selected.slice(0, count);
}

/**
 * Calculate the score for a set of answers against questions.
 * @param answers - Array of selected option indices (null = unanswered)
 * @param questions - The questions that were answered
 * @returns Object with correct count and percentage (0–100)
 */
export function calculateScore(
  answers: (number | null)[],
  questions: QuestionData[]
): { correct: number; total: number; percentage: number } {
  let correct = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] !== null && answers[i] === questions[i].correctIndex) {
      correct++;
    }
  }
  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { correct, total, percentage };
}

/**
 * Get the categories of incorrectly answered questions.
 * Useful for identifying weak areas.
 * @param answers - Array of selected option indices
 * @param questions - The questions that were answered
 * @returns Array of category names for wrong answers
 */
export function getWrongCategories(
  answers: (number | null)[],
  questions: QuestionData[]
): string[] {
  const categories: string[] = [];
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] !== null && answers[i] !== questions[i].correctIndex) {
      categories.push(questions[i].category);
    }
  }
  return categories;
}

/**
 * Generate an explanation for an answer choice.
 * If the selected index is correct, returns the question's explanation.
 * If wrong, returns the explanation prefixed with a correction note.
 * @param question - The question
 * @param selectedIndex - The user's selected option index
 * @returns Formatted explanation string
 */
export function generateExplanation(
  question: QuestionData,
  selectedIndex: number
): string {
  const options = parseOptions(question);
  const isCorrect = selectedIndex === question.correctIndex;

  if (isCorrect) {
    return `✅ Correct! ${question.explanation}`;
  }

  const correctAnswer = options[question.correctIndex] ?? 'Unknown';
  return `❌ Incorrect. The correct answer is: "${correctAnswer}". ${question.explanation}`;
}

/**
 * Shuffle the options of all questions while preserving the correct answer tracking.
 * Returns new ShuffledQuestion objects with remapped correctIndex.
 * @param questions - Array of questions to shuffle
 * @returns Array of ShuffledQuestion with shuffled options and updated correctIndex
 */
export function shuffleOptions(questions: QuestionData[]): ShuffledQuestion[] {
  return questions.map((q) => {
    const options = parseOptions(q);
    const correctOption = options[q.correctIndex];

    const shuffled = fisherYatesShuffle(options);
    const newCorrectIndex = shuffled.indexOf(correctOption);

    return {
      question: q,
      options: shuffled,
      correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : q.correctIndex,
    };
  });
}

/**
 * Filter questions by tags. A question matches if it has any of the given tags.
 * @param questions - Pool of questions
 * @param tags - Tags to filter by
 * @returns Questions that have at least one matching tag
 */
export function filterByTags(
  questions: QuestionData[],
  tags: string[]
): QuestionData[] {
  if (tags.length === 0) return questions;
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));

  return questions.filter((q) => {
    const questionTags = parseJsonArray(q.tags);
    return questionTags.some((t) => tagSet.has(t.toLowerCase()));
  });
}
