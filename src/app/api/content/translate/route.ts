import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { buildLocalizationInstruction } from '@/lib/content-localization';
import { isValidLocale } from '@/i18n/config';

let zaiClient: Awaited<ReturnType<typeof ZAI.create>> | null = null;
async function getZAI() {
  if (!zaiClient) zaiClient = await ZAI.create();
  return zaiClient;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      content?: string;
      locale?: string;
      country?: { code?: string; name?: string };
      contentType?: 'course' | 'exam' | 'quiz' | 'sign' | 'alert' | 'ai' | 'general';
    };

    if (!body.content?.trim()) {
      return NextResponse.json({ error: 'Contenu requis' }, { status: 400 });
    }
    if (!body.locale || !isValidLocale(body.locale)) {
      return NextResponse.json({ error: 'Langue ADSO invalide' }, { status: 400 });
    }
    if (!body.country?.code || !body.country?.name) {
      return NextResponse.json({ error: 'Pays cible requis' }, { status: 400 });
    }

    const zai = await getZAI();
    const response = await zai.chat.completions.create({
      model: 'deepseek-v3',
      temperature: 0.15,
      max_tokens: 1800,
      messages: [
        {
          role: 'system',
          content: buildLocalizationInstruction({
            locale: body.locale,
            country: { code: body.country.code, name: body.country.name },
            contentType: body.contentType,
          }),
        },
        {
          role: 'user',
          content: `Translate and localize the following ADSO content. Keep the road reality of ${body.country.name} unchanged and output only the localized learner-facing content:\n\n${body.content.trim()}`,
        },
      ],
    });

    const translated = typeof response === 'string'
      ? response
      : (response as { choices?: Array<{ message?: { content?: string } }> })?.choices?.[0]?.message?.content;

    if (!translated) {
      return NextResponse.json({ error: 'Traduction indisponible' }, { status: 502 });
    }

    return NextResponse.json({
      content: translated,
      locale: body.locale,
      country: body.country,
      contentType: body.contentType ?? 'general',
    });
  } catch (error) {
    console.error('[POST /api/content/translate] Error:', error);
    return NextResponse.json({ error: 'Erreur de localisation du contenu' }, { status: 500 });
  }
}
