import { NextRequest } from 'next/server'
import { openSourceFrancoiseFallback } from '@/lib/francoise-open-source'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type GatewayResponse = {
  choices?: Array<{ message?: { content?: string } }>
  output_text?: string
  error?: { message?: string }
}

type AiOptions = {
  maxTokens?: number
  temperature?: number
  model?: string
  agent?: string
}

const DEFAULT_TIMEOUT_MS = 20_000
const DEFAULT_VERCEL_MODEL = 'openai/gpt-5.4'
const DEFAULT_OPENAI_MODEL = 'gpt-5.4'

function omniRouteModel(options: AiOptions) {
  return options.model || process.env.OMNIROUTE_MODEL || process.env.ADSO_AI_MODEL || 'auto'
}

function managedGatewayModel(options: AiOptions) {
  return options.model || process.env.ADSO_AI_MODEL || DEFAULT_VERCEL_MODEL
}

function directOpenAIModel(options: AiOptions) {
  return options.model || process.env.ADSO_OPENAI_MODEL || process.env.ADSO_AI_MODEL || DEFAULT_OPENAI_MODEL
}

async function fetchJson(url: string, init: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: 'no-store' })
  } finally {
    clearTimeout(timer)
  }
}

async function callOmniRoute(messages: ChatMessage[], options: AiOptions) {
  const baseUrl = process.env.OMNIROUTE_BASE_URL?.replace(/\/$/, '')
  const token = process.env.OMNIROUTE_API_KEY
  if (!baseUrl || !token) throw new Error('OmniRoute is not configured')

  const response = await fetchJson(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-ADSO-Agent': options.agent || 'unknown',
    },
    body: JSON.stringify({
      model: omniRouteModel(options),
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 500,
      stream: false,
    }),
  })

  const payload = await response.json().catch(() => ({})) as GatewayResponse
  if (!response.ok) throw new Error(`OmniRoute ${response.status}: ${payload.error?.message || 'request failed'}`)
  const content = payload.choices?.[0]?.message?.content
  if (!content) throw new Error('OmniRoute returned an empty response')
  return content
}

async function callVercelGateway(gatewayToken: string, messages: ChatMessage[], options: AiOptions) {
  const response = await fetchJson('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${gatewayToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: managedGatewayModel(options),
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 500,
      stream: false,
    }),
  })

  const payload = await response.json().catch(() => ({})) as GatewayResponse
  if (!response.ok) throw new Error(`AI Gateway ${response.status}: ${payload.error?.message || 'request failed'}`)
  const content = payload.choices?.[0]?.message?.content || payload.output_text
  if (!content) throw new Error('AI Gateway returned an empty response')
  return content
}

async function callOpenAI(openAiKey: string, messages: ChatMessage[], options: AiOptions) {
  const response = await fetchJson('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: directOpenAIModel(options),
      input: messages,
      max_output_tokens: options.maxTokens ?? 500,
    }),
  })

  const payload = await response.json().catch(() => ({})) as GatewayResponse
  if (!response.ok) throw new Error(`OpenAI ${response.status}: ${payload.error?.message || 'request failed'}`)
  if (!payload.output_text) throw new Error('OpenAI returned an empty response')
  return payload.output_text
}

export async function aiChat(request: NextRequest, messages: ChatMessage[], options: AiOptions = {}) {
  const gatewayToken = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN
  const failures: string[] = []

  // 1. OmniRoute: preferred ADSO multi-provider gateway when configured.
  if (process.env.OMNIROUTE_BASE_URL && process.env.OMNIROUTE_API_KEY) {
    try {
      return await callOmniRoute(messages, options)
    } catch (error) {
      failures.push(error instanceof Error ? error.message : 'OmniRoute failed')
    }
  }

  // 2. Vercel AI Gateway: managed routing/failover.
  if (gatewayToken) {
    try {
      return await callVercelGateway(gatewayToken, messages, options)
    } catch (error) {
      failures.push(error instanceof Error ? error.message : 'Vercel AI Gateway failed')
    }
  }

  // 3. Direct OpenAI fallback for environments where a gateway is unavailable.
  if (process.env.OPENAI_API_KEY) {
    try {
      return await callOpenAI(process.env.OPENAI_API_KEY, messages, options)
    } catch (error) {
      failures.push(error instanceof Error ? error.message : 'OpenAI failed')
    }
  }

  // 4. Existing local/open-source Françoise fallback.
  const openSourceReply = await openSourceFrancoiseFallback(request, messages, options)
  if (openSourceReply) return openSourceReply

  throw new Error(`All AI routes failed: ${failures.join(' | ') || 'no AI provider configured'}`)
}
