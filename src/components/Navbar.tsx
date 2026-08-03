'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, ArrowLeft, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';

const navLinks = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Statistiques', href: '#stats' },
  { label: 'Écosystème', href: '#ecosystem' },
  { label: 'Intelligence IA', href: '#ai-features' },
  { label: 'Plateforme', href: '#dashboard' },
  { label: 'Quiz', href: '#quiz' },
  { label: 'IA Coach', href: '#ai-chat' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'Roadmap', href: '#roadmap' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { currentView, setView } = useViewStore();

  const isBlueprint = currentView === 'blueprint';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (!isBlueprint) {
        const sections = navLinks.map((l) => l.href.replace('#', ''));
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.getBoundingClientRect().top <= 120) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBlueprint]);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewToggle = () => {
    setIsMobileOpen(false);
    setView(isBlueprint ? 'app' : 'blueprint');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isBlueprint
            ? 'bg-slate-950/95 backdrop-blur-md shadow-lg border-b border-slate-800'
            : isScrolled
              ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200'
              : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <button
              onClick={() => {
                if (isBlueprint) {
                  setView('app');
                } else {
                  handleNavClick('#hero');
                }
              }}
              className="flex items-center gap-2 group"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                isBlueprint
                  ? 'bg-emerald-600 group-hover:bg-emerald-700'
                  : isScrolled
                    ? 'bg-emerald-600 group-hover:bg-emerald-700'
                    : 'bg-emerald-600 group-hover:bg-emerald-700'
              }`}>
                <Car className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-xl font-bold tracking-tight transition-colors ${
                  isBlueprint ? 'text-white' : isScrolled ? 'text-slate-900' : 'text-white'
                }`}
              >
                ADSO
              </span>
              {isBlueprint && (
                <span className="hidden sm:inline-flex ml-2 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-300">
                  Blueprint
                </span>
              )}
            </button>

            {/* Desktop Nav — only in app view */}
            {!isBlueprint && (
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
            )}

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isBlueprint ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={handleViewToggle}
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">Retour à l&apos;app</span>
                  <span className="sm:hidden">Retour</span>
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="hidden md:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleNavClick('#dashboard')}
                  >
                    Essai gratuit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`hidden lg:inline-flex ${
                      isScrolled
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        : 'border-white/30 text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={handleViewToggle}
                  >
                    <FileCode className="w-4 h-4 mr-1.5" />
                    Architecture
                  </Button>
                </>
              )}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`lg:hidden p-2 rounded-md transition-colors ${
                  isBlueprint
                    ? 'text-slate-300 hover:bg-slate-800'
                    : isScrolled
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
            <div className={`absolute top-16 left-0 right-0 shadow-xl border-b max-h-[80vh] overflow-y-auto ${
              isBlueprint
                ? 'bg-slate-950 border-slate-800'
                : 'bg-white border-slate-200'
            }`}>
              <div className="px-4 py-3 space-y-1">
                {!isBlueprint ? (
                  <>
                    {navLinks.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => handleNavClick(link.href)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isBlueprint
                            ? 'text-slate-300 hover:bg-slate-800'
                            : activeSection === link.href.replace('#', '')
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {link.label}
                      </button>
                    ))}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        Essai gratuit
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleViewToggle}
                      >
                        <FileCode className="w-4 h-4 mr-1.5" />
                        Architecture
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className={`w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white`}
                    onClick={handleViewToggle}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Retour à l&apos;application
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
