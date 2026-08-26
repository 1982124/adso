'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function SmartSharePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  useEffect(() => {
    const slug = String(params?.slug || '').trim().toLowerCase();
    if (slug) {
      try { window.localStorage.setItem('adso_share_source', slug); } catch {}
      document.cookie = `adso_share_source=${encodeURIComponent(slug)}; Path=/; Max-Age=2592000; SameSite=Lax`;
    }
    router.replace('/');
  }, [params, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1F33] px-6 text-center text-white">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D7B45A]">ADSO AFRICA</p>
        <h1 className="mt-3 text-2xl font-black">Bienvenue dans la mission.</h1>
        <p className="mt-2 text-sm text-slate-300">Ouverture de la plateforme…</p>
      </div>
    </main>
  );
}
