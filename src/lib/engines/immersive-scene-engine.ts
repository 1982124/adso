export type ImmersiveChoice = {
  id: string;
  label: string;
  isCorrect: boolean;
  scoreDelta: number;
  consequence: string;
  explanation: string;
  competency?: string | null;
  nextInteractionId?: string | null;
};

export type ImmersiveInteraction = {
  id: string;
  type: 'question' | 'decision' | 'observation' | 'prediction' | 'diagnostic' | 'action';
  atSecond: number;
  prompt: string;
  explanation?: string | null;
  ttsText?: string | null;
  points: number;
  choices: ImmersiveChoice[];
};

export type ImmersiveAnswer = {
  interactionId: string;
  choiceId: string;
  scoreDelta: number;
  correct: boolean;
};

export type ImmersiveResult = {
  score: number;
  maxScore: number;
  accuracy: number;
  competencyGain: number;
  completed: boolean;
  answers: ImmersiveAnswer[];
};

/** Pure, deterministic scoring logic used by both API and UI tests. */
export function evaluateScene(
  interactions: ImmersiveInteraction[],
  answers: ImmersiveAnswer[],
): ImmersiveResult {
  const answerMap = new Map(answers.map((answer) => [answer.interactionId, answer]));
  const maxScore = interactions.reduce((sum, interaction) => sum + Math.max(0, interaction.points), 0);
  const score = interactions.reduce((sum, interaction) => {
    const answer = answerMap.get(interaction.id);
    return sum + Math.max(0, Math.min(interaction.points, answer?.scoreDelta ?? 0));
  }, 0);
  const correct = interactions.reduce((sum, interaction) => sum + (answerMap.get(interaction.id)?.correct ? 1 : 0), 0);
  const accuracy = interactions.length ? correct / interactions.length : 0;
  const competencyGain = Math.round(accuracy * 100);

  return {
    score,
    maxScore,
    accuracy,
    competencyGain,
    completed: interactions.length > 0 && interactions.every((interaction) => answerMap.has(interaction.id)),
    answers,
  };
}

export function clampVideoDuration(seconds: number): number {
  return Math.min(60, Math.max(15, Math.round(seconds)));
}

export function normalizePause(second: number, durationSeconds: number): number {
  return Math.min(Math.max(0, second), Math.max(0, durationSeconds - 1));
}
