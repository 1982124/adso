'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, Home, GraduationCap, Shield, Building2, LayoutDashboard, Globe2, BookOpen, Route, UserRound } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FrancoiseAssistant } from '@/components/FrancoiseAssistant';
import { useViewStore, type AppModule } from '@/stores/view-store';

const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = { Home, GraduationCap, Car, Shield, Building2 };

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { currentView, setView, openLearningTab } = useViewStore();
  const isHome = currentView === 'home';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setIsMobileOpen(false);
  const go = (action: () => void) => { close(); action(); };
  const textPrimary = isScrolled ? 'text-slate-900' : 'text-white';
  const textSecondary = isScrolled ? 'text-slate-600' : 'text-white/85';
  const hoverBg = isScrolled ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-white/10 hover:text-white';

  const navItems = [
    { label: 'Accueil', icon: Home, active: currentView === 'home', action: () => setView('home') },
    { label: 'Formation', icon: GraduationCap, active: currentView === 'learning', action: () => setView('learning') },
    { label: 'ADSO Immersif', icon: Car, active: currentView === 'driving', action: () => setView('driving') },
    { label: 'Mon parcours', icon: Route, active: false, action: () => openLearningTab('progression') },
    { label: 'Sécurité', icon: Shield, active: currentView === 'security', action: () => setView('security') },
  ];

  return <>
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: .6, ease: 'easeOut' }} className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-slate-200 bg-white/95 shadow-lg backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 items-center justify-between lg:h-16">
          <button type="button" onClick={() => go(() => setView('home'))} className="group flex shrink-0 items-center gap-2" aria-label="ADSO Accueil">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 transition-colors group-hover:bg-emerald-700"><Car className="h-5 w-5 text-white" /></span>
            <span className={`text-lg font-bold tracking-tight ${textPrimary}`}>ADSO</span>
          </button>

          <div className="hidden items-center gap-0.5 xl:flex">
            {navItems.map(({ label, icon: Icon, active, action }) => <button key={label} type="button" onClick={() => go(action)} className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium transition-all ${active ? 'bg-emerald-50 text-emerald-700' : `${textSecondary} ${hoverBg}`}`}><Icon className="h-4 w-4" /><span>{label}</span></button>)}
            <Link href="/ebooks" className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium ${textSecondary} ${hoverBg}`}><BookOpen className="h-4 w-4" /><span>E-books</span></Link>
            <button type="button" onClick={() => go(() => document.getElementById('international')?.scrollIntoView({ behavior: 'smooth' }))} className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium ${textSecondary} ${hoverBg}`}><Globe2 className="h-4 w-4" /><span>Afrique</span></button>
            <button type="button" onClick={() => go(() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' }))} className={`rounded-md px-2.5 py-2 text-sm font-medium ${textSecondary} ${hoverBg}`}>Tarifs</button>
            <button type="button" onClick={() => go(() => setView('enterprise'))} className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium ${currentView === 'enterprise' ? 'bg-emerald-50 text-emerald-700' : `${textSecondary} ${hoverBg}`}`}><Building2 className="h-4 w-4" /><span>Établissements</span></button>
          </div>

          <div className="flex items-center gap-1">
            {isHome && <Button size="sm" className="hidden bg-emerald-600 text-white hover:bg-emerald-700 md:inline-flex" onClick={() => go(() => setView('learning'))}>Commencer</Button>}
            <div className="lg:hidden"><FrancoiseAssistant floating={false} compact /></div>
            <button type="button" onClick={() => setIsMobileOpen(v => !v)} className={`rounded-full p-2 transition-colors ${textSecondary} ${hoverBg}`} aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={isMobileOpen}>{isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
      </div>
    </motion.nav>

    <AnimatePresence>{isMobileOpen && <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="fixed inset-0 z-40 lg:hidden">
      <button type="button" aria-label="Fermer le menu" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <div className="absolute left-0 right-0 top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-slate-200 bg-white shadow-xl">
        <div className="space-y-1 px-4 py-3">
          <Link href="/admin" onClick={close} className="flex w-full items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-400/[0.08] px-4 py-3 text-sm font-bold text-amber-700"><LayoutDashboard className="h-5 w-5" /><span>Cockpit Admin</span></Link>
          {navItems.map(({ label, icon: Icon, active, action }) => <button type="button" key={label} onClick={() => go(action)} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium ${active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}><Icon className="h-5 w-5" /><span>{label}</span></button>)}
          <Link href="/ebooks" onClick={close} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"><BookOpen className="h-5 w-5" /><span>E-books</span></Link>
          <button type="button" onClick={() => go(() => { setView('home'); setTimeout(() => document.getElementById('international')?.scrollIntoView({ behavior: 'smooth' }), 50); })} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"><Globe2 className="h-5 w-5" /><span>Afrique</span></button>
          <button type="button" onClick={() => go(() => { setView('home'); setTimeout(() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' }), 50); })} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"><UserRound className="h-5 w-5" /><span>Tarifs</span></button>
          <button type="button" onClick={() => go(() => setView('enterprise'))} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"><Building2 className="h-5 w-5" /><span>Établissements</span></button>
          <Button type="button" className="mt-2 w-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => go(() => setView('learning'))}>Commencer la formation</Button>
        </div>
      </div>
    </motion.div>}</AnimatePresence>
  </>;
}
