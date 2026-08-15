'use client';

import { useEffect } from 'react';

const RECOVERY_KEY = 'adso-chunk-recovery-attempted';

export default function ChunkLoadRecovery() {
  useEffect(() => {
    const recover = () => {
      const alreadyAttempted = sessionStorage.getItem(RECOVERY_KEY) === '1';
      if (alreadyAttempted) return;
      sessionStorage.setItem(RECOVERY_KEY, '1');
      const url = new URL(window.location.href);
      url.searchParams.set('_adso_reload', String(Date.now()));
      window.location.replace(url.toString());
    };

    const onError = (event: ErrorEvent) => {
      const message = `${event.message || ''} ${event.error?.message || ''}`;
      if (/ChunkLoadError|Loading chunk|dynamically imported module|Failed to fetch dynamically imported module/i.test(message)) recover();
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const message = String(event.reason?.message || event.reason || '');
      if (/ChunkLoadError|Loading chunk|dynamically imported module|Failed to fetch dynamically imported module/i.test(message)) recover();
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('_adso_reload')) {
      sessionStorage.removeItem(RECOVERY_KEY);
      const url = new URL(window.location.href);
      url.searchParams.delete('_adso_reload');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  return null;
}
