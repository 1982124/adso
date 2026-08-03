import type { ReactNode } from 'react';

interface PartProps {
  id: string;
  partNumber: string;
  title: string;
  children: ReactNode;
}

export default function BlueprintPart({ id, partNumber, title, children }: PartProps) {
  return (
    <section
      id={id}
      data-blueprint-section
      className="scroll-mt-16 px-4 sm:px-6 lg:px-10 xl:px-16 py-16 sm:py-20"
    >
      <div className="max-w-4xl mx-auto">
        {/* Card container */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-6 sm:p-8 lg:p-10">
          {/* Part number badge + title */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3.5 py-1 mb-4">
              Partie {partNumber}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight leading-tight">
              {title}
            </h2>
          </div>

          {/* Content */}
          <div className="text-slate-300 leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
