'use client';

import { useCallback } from 'react';
import { Globe, Check, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLocaleStore } from '@/stores/locale-store';
import { useAppLocale } from '@/i18n/client';
import { locales, localeNames, localeFlags, localeDirections, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

export default function LocaleSwitcher() {
  const storeLocale = useLocaleStore((s) => s.locale);
  const { setLocale, direction } = useAppLocale();
  const isRtl = direction === 'rtl';

  const currentCode = (locales as readonly string[]).includes(storeLocale)
    ? (storeLocale as Locale)
    : 'fr';

  const handleSelect = useCallback(
    (code: string) => {
      setLocale(code);
    },
    [setLocale]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'gap-1.5 px-2 h-9 text-sm font-medium transition-colors',
            'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
            'dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
          )}
          aria-label={localeNames[currentCode]}
        >
          <span className="text-base" aria-hidden="true">{localeFlags[currentCode]}</span>
          <span className="hidden sm:inline">{localeNames[currentCode]}</span>
          {isRtl && (
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              RTL
            </span>
          )}
          <ArrowLeftRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 max-h-96 overflow-y-auto"
        sideOffset={8}
      >
        <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          Langue / Language
        </div>
        <DropdownMenuSeparator />
        {(locales as readonly Locale[]).map((loc) => {
          const isActive = loc === currentCode;
          const isRtlLocale = localeDirections[loc] === 'rtl';

          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleSelect(loc)}
              className={cn(
                'flex items-center gap-3 px-2 py-2 cursor-pointer',
                isActive && 'bg-emerald-50 dark:bg-emerald-950/30'
              )}
            >
              <span className="text-lg flex-shrink-0" aria-hidden="true">{localeFlags[loc]}</span>
              <span className="flex-1 text-sm">{localeNames[loc]}</span>
              {isRtlLocale && (
                <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  RTL
                </span>
              )}
              {isActive && (
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
