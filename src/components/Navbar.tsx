'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, Home, GraduationCap, Shield, Building2, LayoutDashboard, Globe2, BookOpen, Route } from 'lucide-react';
import Link from 'next/link';
import { FrancoiseAssistant } from '@/components/FrancoiseAssistant';

const items = [
  { label: 'Accueil', href: '/', icon: Home },
  { label: 'Éducation routière', href: '/education', icon: GraduationCap },
  { label: 'ADSO Immersif', href: '/formation/immersive', icon: Car },
  { label: 'Mon parcours', href: '/student', icon: Route },
  { label: 'Conducteur', href: '/student?profile=taxi-voiture', icon: Car },
  { label: 'Sécurité', href: '/securite', icon: Shield },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const onScroll = () => setIsScrolled(window.scrollY > 50); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  const text = isScrolled ? 'text-slate-700' : 'text-white/90';
  const hover = isScrolled ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-white/10 hover:text-white';
  const close = () => setOpen(false);
  return <>
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: .6 }} className={`fixed inset-x-0 top-0 z-50 ${isScrolled ? 'border-b border-slate-200 bg-white/95 shadow-lg backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-3 sm:px-4 lg:h-16 lg:px-6">
        <Link href="/" aria-label="ADSO Accueil" className={`flex items-center gap-2 text-lg font-bold ${isScrolled ? 'text-slate-900' : 'text-white'}`}><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600"><Car className="h-5 w-5 text-white" /></span>ADSO</Link>
        <div className="hidden items-center gap-0.5 xl:flex">
          {items.map(({ label, href, icon: Icon }) => <Link key={label} href={href} className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium ${text} ${hover}`}><Icon className="h-4 w-4" />{label}</Link>)}
          <Link href="/ebooks" className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium ${text} ${hover}`}><BookOpen className="h-4 w-4" />E-books</Link>
          <Link href="/afrique" className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium ${text} ${hover}`}><Globe2 className="h-4 w-4" />Afrique</Link>
          <Link href="/offres" className={`rounded-md px-2.5 py-2 text-sm font-medium ${text} ${hover}`}>Tarifs</Link>
          <Link href="/institutions" className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium ${text} ${hover}`}><Building2 className="h-4 w-4" />Établissements</Link>
        </div>
        <div className="flex items-center gap-2"><div className="lg:hidden"><FrancoiseAssistant floating={false} compact /></div><button type="button" onClick={() => setOpen(v => !v)} className={`rounded-full p-2 ${text} ${hover}`} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
      </div>
    </motion.nav>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="fixed inset-x-0 top-14 z-40 border-b border-slate-200 bg-white shadow-xl lg:hidden"><div className="grid gap-1 p-4">{items.map(({ label, href, icon: Icon }) => <Link key={label} href={href} onClick={close} className="flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"><Icon className="h-5 w-5" />{label}</Link>)}<Link href="/ebooks" onClick={close} className="flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"><BookOpen className="h-5 w-5" />E-books</Link><Link href="/afrique" onClick={close} className="flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"><Globe2 className="h-5 w-5" />Afrique</Link><Link href="/offres" onClick={close} className="rounded-lg px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100">Tarifs</Link><Link href="/institutions" onClick={close} className="flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"><Building2 className="h-5 w-5" />Établissements</Link><Link href="/admin" onClick={close} className="flex items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-50 px-4 py-3 font-bold text-amber-700"><LayoutDashboard className="h-5 w-5" />Cockpit Admin</Link></div></motion.div>}</AnimatePresence>
  </>;
}
