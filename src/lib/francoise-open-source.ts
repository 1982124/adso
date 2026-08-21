/**
 * Optional open-model fallback for Françoise.
 *
 * The application keeps the existing Vercel AI Gateway as the primary path.
 * If an OpenAI/Gateway call is unavailable and HF_INFERENCE_API_KEY is set,
 * this module can call an open-weight instruction model through Hugging Face.
 * No secret is stored in source control.
 */
import type { NextRequest } from 'next/server';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const DEFAULT_MODEL = 'Qwen/Qwen2.5-7B-Instruct';

export async function openSourceFrancoiseFallback(
  _request: NextRequest,
  messages: ChatMessage[],
  options: { maxTokens?: number } = {},
) {
  const token = process.env.HF_INFERENCE_API_KEY;
  if (!token) return null;

  const model = process.env.ADSO_OPEN_SOURCE_AI_MODEL || DEFAULT_MODEL;
  const response = await fetch(`https://router.huggingface.co/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: options.maxTokens ?? 500,
      temperature: 0.4,
      stream: false,
    }),
    cache: 'no-store',
  });

  if (!response.ok) return null;
  const payload = await response.json().catch(() => ({})) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return payload.choices?.[0]?.message?.content?.trim() || null;
}
