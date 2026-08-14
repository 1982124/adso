import { NextRequest } from 'next/server'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function aiChat(
  request: NextRequest,
  messages: ChatMessage[],
  options: { maxTokens?: number; temperature?: number; model?: string } = {},
) {
  const token =
    process.env.AI_GATEWAY_API_KEY ||
    request.headers.get('x-vercel-oidc-token') ||
    process.env.VERCEL_OIDC_TOKEN

  if (!token) {
    throw new Error('AI Gateway authentication is not configured')
  }

  const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || process.env.ADSO_AI_MODEL || 'openai/gpt-5.4',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 500,
      stream: false,
    }),
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => ({})) as {
    choices?: Array<{ message?: { content?: string } }>
    error?: { message?: string }
  }

  if (!response.ok) {
    throw new Error(`AI Gateway ${response.status}: ${payload.error?.message || 'request failed'}`)
  }

  const content = payload.choices?.[0]?.message?.content
  if (!content) throw new Error('AI Gateway returned an empty response')
  return content
}
