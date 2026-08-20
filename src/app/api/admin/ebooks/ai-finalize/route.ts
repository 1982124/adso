import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 250 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['application/pdf', 'application/epub+zip']);

function canManage(role: unknown) {
  return ['admin', 'super_admin', 'instructor'].includes(String(role ?? 'student'));
}

function safeJson(text: string) {
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned) as Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;
  if (!canManage((session?.user as Record<string, unknown> | undefined)?.role)) {
    return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'OPENAI_API_KEY non configurée pour l’analyse de documents.' }, { status: 503 });

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'PDF ou EPUB requis.' }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: 'Format non autorisé. Utilisez PDF ou EPUB.' }, { status: 400 });
    if (file.size <= 0 || file.size > MAX_BYTES) return NextResponse.json({ error: 'Fichier trop volumineux.' }, { status: 400 });

    const upload = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: (() => { const fd = new FormData(); fd.append('purpose', 'user_data'); fd.append('file', file, file.name); return fd; })(),
    });
    const uploadData = await upload.json().catch(() => ({})) as { id?: string; error?: { message?: string } };
    if (!upload.ok || !uploadData.id) throw new Error(uploadData.error?.message || 'Impossible de transmettre le document à l’IA.');

    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.ADSO_AI_MODEL || 'gpt-5.6',
          input: [{ role: 'user', content: [
            { type: 'input_file', file_id: uploadData.id },
            { type: 'input_text', text: `Tu es l’éditeur commercial eBook d’ADSO. Analyse le document fourni sans inventer de faits. Prépare un produit commercial prêt à être vérifié par un administrateur. Retourne UNIQUEMENT un JSON valide avec ces clés : title, author, description, shortDescription, language, category, audience, keywords (tableau), suggestedPriceXof (nombre), slug, salesPitch, faq (tableau d’objets question/answer), seoTitle, seoDescription, rightsWarning. Si une information n’est pas déterminable, utilise une chaîne vide ou une valeur null et signale-le dans rightsWarning. Ne déclare jamais que les droits de vente sont acquis.` },
          ] }],
          max_output_tokens: 2500,
        }),
      });
      const data = await response.json().catch(() => ({})) as { output_text?: string; error?: { message?: string } };
      if (!response.ok || !data.output_text) throw new Error(data.error?.message || 'Analyse IA indisponible.');
      const metadata = safeJson(data.output_text);
      const title = String(metadata.title || file.name.replace(/\.(pdf|epub)$/i, '')).trim();
      const slug = String(metadata.slug || title).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 100) || `ebook-${crypto.randomUUID().slice(0, 8)}`;
      return NextResponse.json({ metadata: { ...metadata, title, slug }, sourceFilename: file.name });
    } finally {
      await fetch(`https://api.openai.com/v1/files/${uploadData.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${apiKey}` } }).catch(() => undefined);
    }
  } catch (error) {
    console.error('[POST /api/admin/ebooks/ai-finalize]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Analyse IA impossible' }, { status: 400 });
  }
}
