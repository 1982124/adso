import { NextRequest } from 'next/server'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type OpenAIResponse = {
  output_text?: string
  error?: { message?: string }
}

type GatewayResponse = {
  choices?: Array<{ message?: { content?: string } }>
  error?: { message?: string }
}

async function callGateway(
  gatewayToken: string,
  messages: ChatMessage[],
  options: { maxTokens?: number; temperature?: number; model?: string },
) {
  const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${gatewayToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || process.env.ADSO_AI_MODEL || 'openai/gpt-5.6',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 500,
      stream: false,
    }),
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => ({})) as GatewayResponse
  if (!response.ok) throw new Error(`AI Gateway ${response.status}: ${payload.error?.message || 'request failed'}`)
  const content = payload.choices?.[0]?.message?.content
  if (!content) throw new Error('AI Gateway returned an empty response')
  return content
}

export async function aiChat(
  request: NextRequest,
  messages: ChatMessage[],
  options: { maxTokens?: number; temperature?: number; model?: string } = {},
) {
  const openAiKey = process.env.OPENAI_API_KEY
  const gatewayToken =
    process.env.AI_GATEWAY_API_KEY ||
    request.headers.get('x-vercel-oidc-token') ||
    process.env.VERCEL_OIDC_TOKEN

  if (openAiKey) {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || process.env.ADSO_AI_MODEL || 'gpt-5.6',
        input: messages,
        max_output_tokens: options.maxTokens ?? 500,
      }),
      cache: 'no-store',
    })

    const payload = await response.json().catch(() => ({})) as OpenAIResponse
    if (response.ok) {
      if (!payload.output_text) throw new Error('OpenAI returned an empty response')
      return payload.output_text
    }

    // Do not let a provider-side outage or exhausted OpenAI balance make
    // Françoise unavailable when a separately configured gateway exists.
    if (!gatewayToken) {
      throw new Error(`OpenAI ${response.status}: ${payload.error?.message || 'request failed'}`)
    }
  }

  if (!gatewayToken) throw new Error('AI authentication is not configured')
  return callGateway(gatewayToken, messages, options)
}
