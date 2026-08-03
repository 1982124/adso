'use client';

export interface PartProps {
  className?: string;
}

export function SectionTitle({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
        {children}
      </h2>
      {subtitle && (
        <p className="text-slate-400 text-lg max-w-3xl">{subtitle}</p>
      )}
    </div>
  );
}

export function SubsectionTitle({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <h3
      id={id}
      className="text-xl sm:text-2xl font-semibold text-slate-200 mb-4 mt-10 first:mt-0"
    >
      {children}
    </h3>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        animation: `fadeSlideIn 0.5s ease-out ${delay}s forwards`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes fadeSlideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export function PartWrapper({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`bg-slate-950 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 ${className || ''}`}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}
