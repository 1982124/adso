'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlClientProvider } from '@/i18n/client';

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
    <IntlClientProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </IntlClientProvider>
  );
}
