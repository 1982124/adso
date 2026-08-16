'use client';

import { useEffect } from 'react';

/**
 * ADSO uses one global page reader instead of a Lire button after every paragraph.
 * Kept as a compatibility component so existing imports remain safe.
 */
export function InlineTTSButtons() {
  useEffect(() => {
    document.querySelectorAll('.adso-inline-tts-button').forEach((button) => button.remove());
    document.querySelectorAll('[data-tts-inline="true"]').forEach((element) => element.removeAttribute('data-tts-inline'));
  }, []);
  return null;
}
