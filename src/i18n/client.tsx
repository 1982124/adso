'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLocaleStore } from '@/stores/locale-store';
import { defaultLocale, type Locale, getLocaleDirection, isValidLocale } from './config';

// In-memory cache for loaded messages to avoid re-fetching
const messagesCache = new Map<string, Record<string, unknown>>();

async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  const cached = messagesCache.get(locale);
  if (cached) return cached;

  try {
    const messages = (await import(`./${locale}.json`)).default;
    messagesCache.set(locale, messages as Record<string, unknown>);
    return messages as Record<string, unknown>;
  } catch {
    // Fallback to French
    const fallback = messagesCache.get(defaultLocale);
    if (fallback) return fallback;
    const frenchMessages = (await import('./fr.json')).default;
    messagesCache.set(defaultLocale, frenchMessages as Record<string, unknown>);
    return frenchMessages as Record<string, unknown>;
  }
}

interface IntlClientProviderProps {
  children: React.ReactNode;
  locale?: string;
}

export function IntlClientProvider({ children, locale: propLocale }: IntlClientProviderProps) {
  const storeLocale = useLocaleStore((s) => s.locale);
  const [messages, setMessages] = useState<Record<string, unknown> | null>(null);

  // Derive current locale directly from props/store (no intermediate state)
  const currentLocale = useMemo(
    () => (propLocale && isValidLocale(propLocale) ? propLocale : isValidLocale(storeLocale) ? storeLocale : defaultLocale),
    [propLocale, storeLocale]
  );

  // Load messages when locale changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const msgs = await loadMessages(currentLocale);
      if (!cancelled) {
        setMessages(msgs);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentLocale]);

  // Set dir attribute on html element
  useEffect(() => {
    const dir = getLocaleDirection(currentLocale);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', currentLocale);

    return () => {
      document.documentElement.removeAttribute('dir');
    };
  }, [currentLocale]);

  if (!messages) {
    return null;
  }

  return (
    <NextIntlClientProvider
      locale={currentLocale}
      messages={messages}
    >
      {children}
    </NextIntlClientProvider>
  );
}

/**
 * Hook to get the current locale from the store
 * Convenience wrapper for components that need locale info
 */
export function useAppLocale() {
  const storeLocale = useLocaleStore((s) => s.locale);
  const direction = useLocaleStore((s) => s.direction);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const resolved: Locale = isValidLocale(storeLocale) ? storeLocale : defaultLocale;
  const dir = getLocaleDirection(resolved);

  const changeLocale = useCallback(
    (newLocale: string) => {
      if (isValidLocale(newLocale)) {
        setLocale(newLocale);
      }
    },
    [setLocale]
  );

  return { locale: resolved, direction: dir ?? direction, setLocale: changeLocale };
}
