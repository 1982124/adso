'use client';

export default function TrafficLightActive() {
  return (
    <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8" aria-label="Feu tricolore actif en situation d'apprentissage">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="relative flex items-center gap-8">
        <div className="h-52 w-28 rounded-3xl border-4 border-slate-600 bg-slate-950 p-4 shadow-2xl">
          <div className="flex h-full flex-col items-center justify-between py-1">
            <span className="h-12 w-12 rounded-full bg-red-500 shadow-[0_0_28px_rgba(239,68,68,.75)]" />
            <span className="h-12 w-12 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,.35)] animate-pulse" />
            <span className="h-12 w-12 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,.35)]" />
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="h-3 w-56 rounded-full bg-slate-600" />
          <div className="mt-8 h-3 w-40 rounded-full bg-slate-700" />
          <div className="mt-8 h-3 w-64 rounded-full bg-slate-700" />
          <p className="mt-8 text-xs font-black uppercase tracking-[.2em] text-amber-300">Observer · ralentir · décider</p>
        </div>
      </div>
      <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Illustration interactive · feu actif</div>
    </div>
  );
}
