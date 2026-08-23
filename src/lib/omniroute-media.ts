import { NextRequest } from 'next/server'

const DEFAULT_TIMEOUT_MS = 120_000

function config() {
  const baseUrl = process.env.OMNIROUTE_BASE_URL?.replace(/\/$/, '')
  const apiKey = process.env.OMNIROUTE_API_KEY
  if (!baseUrl || !apiKey) throw new Error('OmniRoute media gateway is not configured')
  return { baseUrl, apiKey }
}

async function requestOmniRoute(path: string, init: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const { baseUrl, apiKey } = config()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...(init.headers || {}),
      },
    })
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new Error(`OmniRoute ${response.status}: ${body.slice(0, 500)}`)
    }
    return response
  } finally {
    clearTimeout(timer)
  }
}

export async function generateImage(input: {
  prompt: string
  model?: string
  size?: string
  quality?: string
  n?: number
  agent?: string
}) {
  const response = await requestOmniRoute('/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-ADSO-Agent': input.agent || 'image-generator',
    },
    body: JSON.stringify({
      model: input.model || process.env.OMNIROUTE_IMAGE_MODEL || 'auto',
      prompt: input.prompt,
      size: input.size || '1024x1024',
      quality: input.quality,
      n: input.n || 1,
    }),
  })
  return response.json()
}

export async function editImage(input: {
  image: Blob
  prompt: string
  mask?: Blob
  model?: string
  agent?: string
}) {
  const form = new FormData()
  form.set('image', input.image)
  form.set('prompt', input.prompt)
  form.set('model', input.model || process.env.OMNIROUTE_IMAGE_EDIT_MODEL || 'auto')
  if (input.mask) form.set('mask', input.mask)

  const response = await requestOmniRoute('/v1/images/edits', {
    method: 'POST',
    headers: { 'X-ADSO-Agent': input.agent || 'image-editor' },
    body: form,
  })
  return response.json()
}

export async function generateVideo(input: {
  prompt: string
  model?: string
  duration?: number
  aspectRatio?: string
  agent?: string
}) {
  const response = await requestOmniRoute('/v1/videos/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-ADSO-Agent': input.agent || 'video-generator',
    },
    body: JSON.stringify({
      model: input.model || process.env.OMNIROUTE_VIDEO_MODEL || 'auto',
      prompt: input.prompt,
      duration: input.duration,
      aspect_ratio: input.aspectRatio,
    }),
  })
  return response.json()
}

export async function generateSpeech(input: {
  text: string
  model?: string
  voice?: string
  format?: string
  agent?: string
}) {
  const response = await requestOmniRoute('/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-ADSO-Agent': input.agent || 'tts',
    },
    body: JSON.stringify({
      model: input.model || process.env.OMNIROUTE_TTS_MODEL || 'auto',
      input: input.text,
      voice: input.voice || 'alloy',
      response_format: input.format || 'mp3',
    }),
  })
  return response
}

export async function transcribeAudio(input: { audio: Blob; model?: string; agent?: string }) {
  const form = new FormData()
  form.set('file', input.audio)
  form.set('model', input.model || process.env.OMNIROUTE_STT_MODEL || 'auto')
  const response = await requestOmniRoute('/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'X-ADSO-Agent': input.agent || 'transcriber' },
    body: form,
  })
  return response.json()
}

export async function moderateContent(input: { text: string; model?: string; agent?: string }) {
  const response = await requestOmniRoute('/v1/moderations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-ADSO-Agent': input.agent || 'moderation',
    },
    body: JSON.stringify({
      model: input.model || process.env.OMNIROUTE_MODERATION_MODEL || 'auto',
      input: input.text,
    }),
  })
  return response.json()
}

export async function listOmniRouteModels() {
  const response = await requestOmniRoute('/v1/models', { method: 'GET' }, 20_000)
  return response.json()
}

export async function omniRouteHealth(request?: NextRequest) {
  try {
    await listOmniRouteModels()
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'OmniRoute unavailable',
    }
  }
}
