'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlClientProvider } from '@/i18n/client';
import { SessionProvider } from 'next-auth/react';
import { GlobalTTSReader } from '@/components/GlobalTTSReader';
import { InlineTTSButtons } from '@/components/InlineTTSButtons';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 60_000,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <IntlClientProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <InlineTTSButtons />
          <GlobalTTSReader />
        </QueryClientProvider>
      </IntlClientProvider>
    </SessionProvider>
  );
}
