'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, ArrowLeft, FileCode, Home, GraduationCap, Wrench, Scan, MapPin, Shield, Store, ChevronDown, ShieldCheck, Truck, Building2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewStore, type AppModule, mainModules, moduleLabels, v41Modules } from '@/stores/view-store';

const homeNavLinks = [
  { label: 'Qui sommes-nous ?', href: '#about' },
  { label: 'Statistiques', href: '#stats' },
  { label: 'Écosystème', href: '#ecosystem' },
  { label: 'Intelligence IA', href: '#ai-features' },
  { label: 'Quiz', href: '#quiz' },
  { label: 'IA Coach', href: '#ai-chat' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'Roadmap', href: '#roadmap' },
];

const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, GraduationCap, Car, Wrench, Scan, MapPin, Shield, Store, ShieldCheck, Truck, Building2, FileCode,
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [modulesOpen, setModulesOpen] = useState(false);
  const { currentView, setView } = useViewStore();
  const isHome = currentView === 'home';
  const isBlueprint = currentView === 'blueprint';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (!isHome) return;
      const sections = ['about', 'stats', 'ecosystem', 'ai-features', 'quiz', 'ai-chat', 'pricing', 'roadmap'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(sections[i]); break; }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    if (currentView !== 'home') setView('home');
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleModuleClick = (module: AppModule) => {
    setIsMobileOpen(false);
    setModulesOpen(false);
    setView(module);
  };

  const navBg = isBlueprint ? 'bg-slate-950/95 backdrop-blur-md shadow-lg border-b border-slate-800' : isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200' : 'bg-transparent';
  const textPrimary = isBlueprint ? 'text-white' : isScrolled ? 'text-slate-900' : 'text-white';
  const textSecondary = isBlueprint ? 'text-slate-300' : isScrolled ? 'text-slate-600' : 'text-white/80';
  const hoverBg = isBlueprint ? 'hover:bg-slate-800 hover:text-white' : isScrolled ? 'hover:text-slate-900 hover:bg-slate-100' : 'hover:text-white hover:bg-white/10';
  const coreDesktopMods: AppModule[] = ['home', 'learning', 'driving', 'mechanic', 'scanner', 'telematics', 'security', 'marketplace'];
  const moreMods: AppModule[] = ['insurance', 'fleet', 'enterprise'];

  return <>
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16">
          <button type="button" onClick={() => setView('home')} className="flex items-center gap-2 group shrink-0" aria-label="ADSO Accueil">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-600 group-hover:bg-emerald-700 transition-colors"><Car className="w-5 h-5 text-white" /></div>
            <span className={`text-lg font-bold tracking-tight ${textPrimary}`}>ADSO</span>
            {!isHome && !isBlueprint && <span className={`hidden sm:inline-flex ml-2 px-2 py-0.5 rounded text-xs font-medium ${v41Modules.includes(currentView) ? 'bg-amber-500/20 text-amber-600' : 'bg-emerald-500/20 text-emerald-600'}`}>{moduleLabels[currentView]?.label}</span>}
            {isBlueprint && <span className="hidden sm:inline-flex ml-2 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-300">Blueprint</span>}
          </button>

          <div className="hidden lg:flex items-center gap-0.5">
            {coreDesktopMods.map((mod) => {
              const Icon = moduleIcons[moduleLabels[mod]?.icon || 'Home'];
              const isActive = currentView === mod;
              return <button type="button" key={mod} onClick={() => handleModuleClick(mod)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all ${isActive ? (isBlueprint ? 'bg-emerald-600/20 text-emerald-300' : isScrolled ? 'bg-emerald-50 text-emerald-700' : 'bg-white/15 text-white') : `${textSecondary} ${hoverBg}`}`}><Icon className="w-4 h-4" /><span>{moduleLabels[mod]?.label}</span></button>;
            })}
            <button type="button" onClick={() => handleNavClick('#about')} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all ${textSecondary} ${hoverBg}`}><Info className="w-4 h-4" /><span>À propos</span></button>
            <div className="relative">
              <button type="button" onClick={() => setModulesOpen(v => !v)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all ${textSecondary} ${hoverBg}`} aria-expanded={modulesOpen}>Plus<ChevronDown className={`w-3.5 h-3.5 transition-transform ${modulesOpen ? 'rotate-180' : ''}`} /></button>
              {modulesOpen && <div className={`absolute right-0 top-full mt-1 py-1 rounded-lg shadow-xl border min-w-[220px] z-50 ${isBlueprint ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>{moreMods.map((mod) => { const Icon = moduleIcons[moduleLabels[mod]?.icon || 'Home']; return <button type="button" key={mod} onClick={() => handleModuleClick(mod)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left ${isBlueprint ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}><Icon className="w-4 h-4" /><div><div className="font-medium">{moduleLabels[mod]?.label}</div><div className="text-xs text-slate-400">{moduleLabels[mod]?.description}</div></div></button>; })}</div>}
            </div>
            <button type="button" onClick={() => handleModuleClick('blueprint')} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all ${isBlueprint ? 'bg-slate-800 text-emerald-300' : `${textSecondary} ${hoverBg}`}`}><FileCode className="w-4 h-4" /><span className="hidden xl:inline">Architecture</span></button>
          </div>

          <div className="flex items-center gap-2">
            {isBlueprint ? <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setView('home')}><ArrowLeft className="w-4 h-4 mr-1.5" /><span className="hidden sm:inline">Retour</span></Button> : isHome ? <Button size="sm" className="hidden md:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setView('learning')}>Commencer la formation</Button> : null}
            <button type="button" onClick={() => setIsMobileOpen(v => !v)} className={`lg:hidden p-2 rounded-md transition-colors ${isBlueprint ? 'text-slate-300 hover:bg-slate-800' : textSecondary}`} aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>{isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
      </div>
    </motion.nav>

    <AnimatePresence>
      {isMobileOpen && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-40 lg:hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
        <div className={`absolute top-14 left-0 right-0 shadow-xl border-b max-h-[85vh] overflow-y-auto ${isBlueprint ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="px-4 py-3 space-y-1">
            {mainModules.map((mod) => { const Icon = moduleIcons[moduleLabels[mod]?.icon || 'Home']; const isActive = currentView === mod; return <button type="button" key={mod} onClick={() => handleModuleClick(mod)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${isActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700 hover:bg-slate-100'}`}><Icon className="w-5 h-5" /><span>{moduleLabels[mod]?.label}</span>{v41Modules.includes(mod) && <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-600">V4</span>}</button>; })}
            {isHome && <><div className="pt-2 mt-2 border-t border-slate-100"><p className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</p></div>{homeNavLinks.map((link) => <button type="button" key={link.href} onClick={() => handleNavClick(link.href)} className={`w-full text-left px-4 py-2.5 pl-8 rounded-lg text-sm ${activeSection === link.href.replace('#', '') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:bg-slate-100'}`}>{link.label}</button>)}<div className="pt-2 mt-2 border-t border-slate-100"><Button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleModuleClick('learning')}>Commencer la formation</Button></div></>}
            <button type="button" onClick={() => handleModuleClick('blueprint')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${currentView === 'blueprint' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700 hover:bg-slate-100'}`}><FileCode className="w-5 h-5" /><span>Architecture</span></button>
          </div>
        </div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
