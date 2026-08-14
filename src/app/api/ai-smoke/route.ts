import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const zai = await ZAI.create();
    const response = await zai.chat.completions.create({
      model: 'deepseek-v3',
      messages: [{ role: 'user', content: 'Réponds uniquement par OK.' }],
      temperature: 0,
      max_tokens: 4,
    });
    const text = typeof response === 'string'
      ? response
      : (response as { choices?: Array<{ message?: { content?: string } }> })?.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ ok: true, response: text.trim().slice(0, 20) });
  } catch (error) {
    console.error('[ai-smoke] failed', error);
    return NextResponse.json({ ok: false, error: 'AI provider unavailable' }, { status: 503 });
  }
}
