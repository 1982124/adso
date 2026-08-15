export type LeadStage = 'new' | 'qualified' | 'contacted' | 'converted' | 'lost';

export type LeadScoreInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  source?: string;
  offer?: string;
};

export function scoreLead(input: LeadScoreInput) {
  let score = 20;
  const reasons: string[] = [];

  if (input.phone) { score += 15; reasons.push('téléphone/WhatsApp fourni'); }
  if (input.company) { score += 15; reasons.push('organisation renseignée'); }
  if (input.offer) { score += 20; reasons.push('offre explicitement sélectionnée'); }
  if (input.country) { score += 10; reasons.push('pays renseigné'); }
  if (input.source && input.source !== 'website') { score += 5; reasons.push('source de campagne identifiée'); }
  if (/^(info|contact|hello|admin|support)@/i.test(input.email)) score -= 5;

  score = Math.max(0, Math.min(100, score));
  const priority = score >= 70 ? 'high' : score >= 45 ? 'medium' : 'low';

  return { score, priority, reasons } as const;
}

export function sanitizeLeadText(value: unknown, max = 160): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}
