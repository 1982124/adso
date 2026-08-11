import type { Locale } from '@/i18n/config';

export interface CountryContext {
  code: string;
  name: string;
}

export interface LocalizedContentRequest {
  content: string;
  locale: Locale;
  country: CountryContext;
  contentType?: 'course' | 'exam' | 'quiz' | 'sign' | 'alert' | 'ai' | 'general';
}

/**
 * Builds the invariant context used whenever ADSO translates country-specific
 * road-safety content. Country is the reality being taught; locale is only the
 * language in which that reality is presented.
 */
export function buildLocalizationInstruction({
  locale,
  country,
  contentType = 'general',
}: Omit<LocalizedContentRequest, 'content'>) {
  return `ADSO localization contract:\n- Target country: ${country.name} (${country.code})\n- Output language/locale: ${locale}\n- Content type: ${contentType}\n- Preserve the target country's road reality, road signs, terminology, driving side, units, laws, institutions and cultural context.\n- Translate the explanation into the selected language; never replace the target country with the user's home country.\n- Never invent a regulation. If a rule is uncertain or time-sensitive, explicitly mark it for source verification.\n- Keep names of official institutions, road signs and legal instruments accurate; add the localized explanation alongside the canonical name when useful.\n- Prefer clear, natural language for a learner, not literal machine translation.`;
}

export function localizationCacheKey({ locale, country, contentType = 'general' }: Omit<LocalizedContentRequest, 'content'>) {
  return `adso:${country.code}:${locale}:${contentType}`.toLowerCase();
}
