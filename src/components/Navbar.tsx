'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, Home, GraduationCap, Shield, Truck, Building2, LayoutDashboard, Globe2, Users, UserRound } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FrancoiseAssistant } from '@/components/FrancoiseAssistant';
import { useViewStore, type AppModule, mainModules, moduleLabels } from '@/stores/view-store';

const homeNavLinks = [
  { label: 'Pourquoi ADSO ?', href: '#stats' }, { label: 'ADSO Immersif', href: '#ai-features' },
  { label: 'Éducation routière', href: '#ecosystem' }, { label: 'ADSO Communauté', href: '/communaute' },
  { label: 'Tarifs', href: '#pricing' }, { label: 'Afrique', href: '#international' }, { label: 'Roadmap', href: '#roadmap' },
];
const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = { Home, GraduationCap, Car, Shield, Truck, Building2 };

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false), [isMobileOpen, setIsMobileOpen] = useState(false), [activeSection, setActiveSection] = useState('hero');
  const { currentView, setView } = useViewStore(); const isHome = currentView === 'home';
  useEffect(() => { const handleScroll = () => { setIsScrolled(window.scrollY > 50); if (!isHome) return; const sections = ['stats','ai-features','ecosystem','pricing','international','roadmap']; for (let i=sections.length-1;i>=0;i--) { const el=document.getElementById(sections[i]); if (el && el.getBoundingClientRect().top<=120) { setActiveSection(sections[i]); break; } } }; window.addEventListener('scroll',handleScroll,{passive:true}); return () => window.removeEventListener('scroll',handleScroll); }, [isHome]);
  const handleNavClick = (href: string) => { setIsMobileOpen(false); if (href.startsWith('/')) return; if (currentView !== 'home') setView('home'); setTimeout(() => document.querySelector(href)?.scrollIntoView({behavior:'smooth',block:'start'}),100); };
  const handleModuleClick = (module: AppModule) => { setIsMobileOpen(false); setView(module); };
  const navBg = isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200' : 'bg-transparent';
  const textPrimary = isScrolled ? 'text-slate-900' : 'text-white', textSecondary = isScrolled ? 'text-slate-600' : 'text-white/80', hoverBg = isScrolled ? 'hover:text-slate-900 hover:bg-slate-100' : 'hover:text-white hover:bg-white/10';
  const coreDesktopMods: AppModule[] = ['home','learning','driving','security','fleet','enterprise'];
  return <>
    <motion.nav initial={{y:-100}} animate={{y:0}} transition={{duration:.6,ease:'easeOut'}} className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4 lg:px-6"><div className="flex h-14 items-center justify-between lg:h-16">
        <button type="button" onClick={() => setView('home')} className="group flex shrink-0 items-center gap-2" aria-label="ADSO Accueil"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 transition-colors group-hover:bg-emerald-700"><Car className="h-5 w-5 text-white"/></div><span className={`text-lg font-bold tracking-tight ${textPrimary}`}>ADSO</span>{!isHome && <span className="ml-2 hidden rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-600 sm:inline-flex">{moduleLabels[currentView]?.label}</span>}</button>
        <div className="hidden items-center gap-0.5 lg:flex">{coreDesktopMods.map(mod => { const Icon=moduleIcons[moduleLabels[mod]?.icon||'Home'], isActive=currentView===mod; return <button type="button" key={mod} onClick={() => handleModuleClick(mod)} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-all ${isActive ? isScrolled ? 'bg-emerald-50 text-emerald-700' : 'bg-white/15 text-white' : `${textSecondary} ${hoverBg}`}`}><Icon className="h-4 w-4"/><span>{moduleLabels[mod]?.label}</span></button>; })}<Link href="/communaute" className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium ${textSecondary} ${hoverBg}`}><Users className="h-4 w-4"/><span>Communauté</span></Link><button type="button" onClick={() => handleNavClick('#international')} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium ${textSecondary} ${hoverBg}`}><Globe2 className="h-4 w-4"/><span>Afrique</span></button></div>
        <div className="flex items-center gap-1"><div className="hidden items-center gap-1 md:flex"><Link href="/connexion" className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-semibold ${textSecondary} ${hoverBg}`}><UserRound className="h-4 w-4"/>Compte</Link><Link href="/inscription" className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-emerald-700">Créer un compte</Link></div>{isHome && <Button size="sm" className="hidden bg-emerald-600 text-white hover:bg-emerald-700 lg:inline-flex" onClick={() => setView('learning')}>Commencer la formation</Button>}<div className="lg:hidden"><FrancoiseAssistant floating={false} compact/></div><button type="button" onClick={() => setIsMobileOpen(v=>!v)} className={`rounded-full p-2 transition-colors ${textSecondary} ${hoverBg}`} aria-label={isMobileOpen?'Fermer le menu':'Ouvrir le menu'}>{isMobileOpen?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button></div>
      </div></div>
    </motion.nav>
    <AnimatePresence>{isMobileOpen && <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} className="fixed inset-0 z-40 lg:hidden"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}/><div className="absolute left-0 right-0 top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-slate-200 bg-white shadow-xl"><div className="space-y-1 px-4 py-3">
      <Link href="/inscription" onClick={() => setIsMobileOpen(false)} className="flex w-full items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"><UserRound className="h-5 w-5"/><span>Créer mon compte ADSO</span></Link>
      <Link href="/connexion" onClick={() => setIsMobileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"><UserRound className="h-5 w-5"/><span>Se connecter</span></Link>
      <Link href="/admin" onClick={() => setIsMobileOpen(false)} className="flex w-full items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-400/[0.08] px-4 py-3 text-sm font-bold text-amber-700"><LayoutDashboard className="h-5 w-5"/><span>Cockpit Admin</span><span className="ml-auto text-xs font-normal text-amber-600">Direction</span></Link>
      <Link href="/communaute" onClick={() => setIsMobileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"><Users className="h-5 w-5"/><span>ADSO Communauté</span></Link>
      {mainModules.filter(mod=>mod!=='insurance').map(mod=>{const Icon=moduleIcons[moduleLabels[mod]?.icon||'Home'],isActive=currentView===mod;return <button type="button" key={mod} onClick={()=>handleModuleClick(mod)} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${isActive?'bg-emerald-50 text-emerald-700':'text-slate-700 hover:bg-slate-100'}`}><Icon className="h-5 w-5"/><span>{moduleLabels[mod]?.label}</span></button>;})}
      {isHome && <><div className="mt-2 border-t border-slate-100 pt-2"><p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Explorer ADSO</p></div>{homeNavLinks.map(link=>link.href.startsWith('/') ? <Link key={link.href} href={link.href} onClick={()=>setIsMobileOpen(false)} className="block w-full rounded-lg px-4 py-2.5 pl-8 text-left text-sm text-slate-600 hover:bg-slate-100">{link.label}</Link> : <button type="button" key={link.href} onClick={()=>handleNavClick(link.href)} className={`w-full rounded-lg px-4 py-2.5 pl-8 text-left text-sm ${activeSection===link.href.replace('#','')?'bg-emerald-50 text-emerald-700':'text-slate-600 hover:bg-slate-100'}`}>{link.label}</button>)}<div className="mt-2 border-t border-slate-100 pt-2"><Button type="button" className="w-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={()=>handleModuleClick('learning')}>Commencer la formation</Button></div></>}
    </div></div></motion.div>}</AnimatePresence>
  </>;
}
