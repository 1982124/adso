'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Écosystème', href: '#ecosystem' },
  { label: 'Intelligence IA', href: '#ai-features' },
  { label: 'Plateforme', href: '#dashboard' },
  { label: 'Quiz IA', href: '#quiz' },
  { label: 'IA Coach', href: '#ai-chat' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'Roadmap', href: '#roadmap' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navLinks.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('#hero')}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-xl font-bold tracking-tight transition-colors ${
                  isScrolled ? 'text-slate-900' : 'text-white'
                }`}
              >
                ADSO
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === link.href.replace('#', '')
                      ? isScrolled
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-emerald-300 bg-white/10'
                      : isScrolled
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleNavClick('#dashboard')}
              >
                Essai gratuit
              </Button>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`lg:hidden p-2 rounded-md transition-colors ${
                  isScrolled
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="absolute top-16 left-0 right-0 bg-white shadow-xl border-b border-slate-200 max-h-[80vh] overflow-y-auto">
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === link.href.replace('#', '')
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-3 border-t border-slate-100">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Essai gratuit
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
