'use client';

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import {
  Eye,
  Layers,
  Server,
  BrainCircuit,
  Cpu,
  DollarSign,
  ShieldCheck,
  Globe,
  Palette,
  BarChart3,
  Container,
  Map,
  Scale,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'vision', label: 'Vision Entreprise', icon: <Eye className="h-4 w-4" /> },
  { id: 'ecosysteme', label: 'Écosystème Complet', icon: <Layers className="h-4 w-4" /> },
  { id: 'architecture', label: 'Architecture Technique', icon: <Server className="h-4 w-4" /> },
  { id: 'ai-scos', label: 'AI-First Architecture (AI-SCOS)', icon: <BrainCircuit className="h-4 w-4" /> },
  { id: 'ia-produit', label: 'IA Produit', icon: <Cpu className="h-4 w-4" /> },
  { id: 'monetisation', label: 'Monétisation', icon: <DollarSign className="h-4 w-4" /> },
  { id: 'securite', label: 'Sécurité Entreprise (CISO)', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'internationalisation', label: 'Internationalisation', icon: <Globe className="h-4 w-4" /> },
  { id: 'ux-ui', label: 'UX/UI Design', icon: <Palette className="h-4 w-4" /> },
  { id: 'data-analytics', label: 'Data & Analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'devops', label: 'DevOps Production', icon: <Container className="h-4 w-4" /> },
  { id: 'roadmap', label: 'Roadmap', icon: <Map className="h-4 w-4" /> },
  { id: 'directives-ia', label: 'Directives IA', icon: <Scale className="h-4 w-4" /> },
];

interface BluePrintLayoutProps {
  children: ReactNode;
}

export default function BluePrintLayout({ children }: BluePrintLayoutProps) {
  const [activeId, setActiveId] = useState<string>('cover');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState<string>('Document de Spécification Maître');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const getActiveTitle = useCallback((id: string) => {
    if (id === 'cover') return 'Document de Spécification Maître';
    const item = NAV_ITEMS.find((n) => n.id === id);
    return item ? `Partie — ${item.label}` : 'Document de Spécification Maître';
  }, []);

  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible entry that's intersecting
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one with the highest ratio
          const top = visible.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b));
          const id = top.target.id;
          setActiveId(id);
          setCurrentTitle(getActiveTitle(id));
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    observerRef.current = observer;

    // Observe all section elements
    const sections = document.querySelectorAll('[data-blueprint-section]');
    sections.forEach((s) => observer.observe(s));

    return () => {
      observer.disconnect();
    };
  }, [getActiveTitle]);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:flex flex-col w-72 min-w-72 h-screen sticky top-0 bg-slate-900 border-r border-slate-700/60 z-40">
        {/* Logo area */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-cyan-400 font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 tracking-tight">ADSO</h1>
              <p className="text-[10px] uppercase tracking-widest text-cyan-500 font-medium">Blueprint</p>
            </div>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-cyan-500/50 via-cyan-500/20 to-transparent" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5" aria-label="Blueprint navigation">
          {NAV_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200 group cursor-pointer
                ${
                  activeId === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }
              `}
              aria-current={activeId === item.id ? 'true' : undefined}
            >
              <span
                className={`flex-shrink-0 transition-colors ${
                  activeId === item.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              >
                {item.icon}
              </span>
              <span className="flex-1 truncate font-medium">{item.label}</span>
              <ChevronRight
                className={`h-3.5 w-3.5 flex-shrink-0 transition-opacity ${
                  activeId === item.id ? 'opacity-60 text-cyan-400' : 'opacity-0 group-hover:opacity-40'
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Footer branding */}
        <div className="px-5 py-4 border-t border-slate-700/60">
          <p className="text-xs text-slate-500 font-medium">ADSO Engineering</p>
          <p className="text-[10px] text-slate-600 mt-0.5">2026 — 2030</p>
        </div>
      </aside>

      {/* ─── Mobile overlay ─── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── Mobile sidebar drawer ─── */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-700/60 z-50 lg:hidden transform transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-cyan-400 font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 tracking-tight">ADSO</h1>
              <p className="text-[10px] uppercase tracking-widest text-cyan-500 font-medium">Blueprint</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-px bg-gradient-to-r from-cyan-500/50 via-cyan-500/20 to-transparent mx-5" />
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 mt-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-200 group cursor-pointer
                ${
                  activeId === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }
              `}
            >
              <span
                className={`flex-shrink-0 transition-colors ${
                  activeId === item.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              >
                {item.icon}
              </span>
              <span className="flex-1 truncate font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-700/60">
          <p className="text-xs text-slate-500 font-medium">ADSO Engineering</p>
          <p className="text-[10px] text-slate-600 mt-0.5">2026 — 2030</p>
        </div>
      </aside>

      {/* ─── Main content area ─── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 flex items-center px-4 lg:px-8 gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse flex-shrink-0" />
            <h2 className="text-sm font-medium text-slate-300 truncate">{currentTitle}</h2>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
