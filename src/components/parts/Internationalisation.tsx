'use client'

import { motion } from 'framer-motion'
import {
  Globe,
  Languages,
  ArrowRightLeft,
  CreditCard,
  Smartphone,
  Wallet,
  Landmark,
  Banknote,
  BadgeCheck,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
}

/* ─── 8.1 Multi-Pays ─── */
const countryPacks = [
  { region: 'Europe', countries: 45, flags: ['🇫🇷', '🇩🇪', '🇪🇸', '🇮🇹', '🇬🇧', '🇳🇱', '🇧🇪'], regulations: ['Code de la route EU', 'Directives CE', 'Normes ECE'] },
  { region: 'Afrique', countries: 35, flags: ['🇲🇦', '🇸🇳', '🇨🇲', '🇨🇮', '🇪🇬', '🇿🇦', '🇳🇬'], regulations: ['CEREMONIA', 'SADC standards', 'RIAS'] },
  { region: 'Asie-Pacifique', countries: 25, flags: ['🇯🇵', '🇰🇷', '🇮🇳', '🇦🇺', '🇹🇭', '🇻🇳', '🇵🇭'], regulations: ['National road codes', 'ASEAN standards', 'JIS'] },
  { region: 'Ameriques', countries: 15, flags: ['🇺🇸', '🇨🇦', '🇧🇷', '🇲🇽', '🇦🇷', '🇨🇴', '🇨🇱'], regulations: ['DMV standards', 'DENATRAN', 'Provincial rules'] },
]

/* ─── 8.2 Multi-Langues ─── */
const languageSamples = [
  { lang: 'Francais', code: 'fr', sample: 'Bienvenue sur ADSO', dir: 'LTR' },
  { lang: 'English', code: 'en', sample: 'Welcome to ADSO', dir: 'LTR' },
  { lang: 'Espanol', code: 'es', sample: 'Bienvenido a ADSO', dir: 'LTR' },
  { lang: 'Arabe', code: 'ar', sample: 'مرحبا بك في ADSO', dir: 'RTL' },
  { lang: 'Hebreu', code: 'he', sample: 'ברוכים הבאים ל ADSO', dir: 'RTL' },
  { lang: 'Portugais', code: 'pt', sample: 'Bem-vindo ao ADSO', dir: 'LTR' },
  { lang: 'Japonais', code: 'ja', sample: 'ADSOへようこそ', dir: 'LTR' },
  { lang: 'Hindi', code: 'hi', sample: 'ADSO में आपका स्वागत है', dir: 'LTR' },
  { lang: 'Mandarin', code: 'zh', sample: '欢迎使用 ADSO', dir: 'LTR' },
  { lang: 'Coreen', code: 'ko', sample: 'ADSO에 오신 것을 환영합니다', dir: 'LTR' },
  { lang: 'Turc', code: 'tr', sample: 'ADSO\'ya hosgeldiniz', dir: 'LTR' },
  { lang: 'Indonesien', code: 'id', sample: 'Selamat datang di ADSO', dir: 'LTR' },
]

/* ─── 8.3 Devises & Paiements ─── */
const paymentRegions = [
  {
    region: 'Europe',
    icon: <Landmark className="h-5 w-5" />,
    methods: [
      { name: 'Cartes bancaires', icon: <CreditCard className="h-4 w-4" /> },
      { name: 'Apple Pay', icon: <Smartphone className="h-4 w-4" /> },
      { name: 'Google Pay', icon: <Wallet className="h-4 w-4" /> },
      { name: 'iDEAL', icon: <Banknote className="h-4 w-4" /> },
      { name: 'Bancontact', icon: <BadgeCheck className="h-4 w-4" /> },
      { name: 'SEPA', icon: <Landmark className="h-4 w-4" /> },
    ],
  },
  {
    region: 'Afrique',
    icon: <Globe className="h-5 w-5" />,
    methods: [
      { name: 'Orange Money', icon: <Smartphone className="h-4 w-4" /> },
      { name: 'M-Pesa', icon: <Wallet className="h-4 w-4" /> },
      { name: 'MTN Mobile Money', icon: <Smartphone className="h-4 w-4" /> },
      { name: 'Wave', icon: <Banknote className="h-4 w-4" /> },
    ],
  },
  {
    region: 'Ameriques',
    icon: <Landmark className="h-5 w-5" />,
    methods: [
      { name: 'Stripe', icon: <CreditCard className="h-4 w-4" /> },
      { name: 'Apple Pay', icon: <Smartphone className="h-4 w-4" /> },
      { name: 'Google Pay', icon: <Wallet className="h-4 w-4" /> },
      { name: 'PIX', icon: <Banknote className="h-4 w-4" /> },
      { name: 'Mercado Pago', icon: <BadgeCheck className="h-4 w-4" /> },
    ],
  },
  {
    region: 'Asie-Pacifique',
    icon: <Globe className="h-5 w-5" />,
    methods: [
      { name: 'WeChat Pay', icon: <Smartphone className="h-4 w-4" /> },
      { name: 'Alipay', icon: <Wallet className="h-4 w-4" /> },
      { name: 'GrabPay', icon: <Smartphone className="h-4 w-4" /> },
      { name: 'PayPay', icon: <Banknote className="h-4 w-4" /> },
      { name: 'Gcash', icon: <BadgeCheck className="h-4 w-4" /> },
    ],
  },
]

export default function Internationalisation() {
  return (
    <section id="international" className="bg-slate-950 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
            Partie 8 — Internationalisation
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Internationalisation
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Concu des le depart pour servir 120+ pays, 50+ langues et 135+ devises
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {[
            { value: '120+', label: 'Pays cibles', icon: <Globe className="h-6 w-6" /> },
            { value: '50+', label: 'Langues au lancement', icon: <Languages className="h-6 w-6" /> },
            { value: '135+', label: 'Devises supportees', icon: <ArrowRightLeft className="h-6 w-6" /> },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900 border-slate-800 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mx-auto mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-cyan-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="pays" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center bg-slate-900 border border-slate-800 h-auto p-1 mb-10">
            <TabsTrigger value="pays" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              8.1 Multi-Pays
            </TabsTrigger>
            <TabsTrigger value="langues" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              8.2 Multi-Langues & RTL
            </TabsTrigger>
            <TabsTrigger value="paiements" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              8.3 Devises & Paiements
            </TabsTrigger>
          </TabsList>

          {/* ─── 8.1 ─── */}
          <TabsContent value="pays">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                8.1 Country Packs — Regulation locale par pays
              </h3>
              <p className="text-slate-400 text-sm">
                Chaque pays dispose de son pack : code de la route, examens, signalisation, procedures
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {countryPacks.map((pack, i) => (
                <motion.div key={pack.region} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-cyan-400" />
                          <CardTitle className="text-base text-slate-200">{pack.region}</CardTitle>
                        </div>
                        <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
                          {pack.countries} pays
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {pack.flags.map((flag) => (
                          <span key={flag} className="text-2xl" role="img" aria-label="flag">
                            {flag}
                          </span>
                        ))}
                        <span className="text-xs text-slate-500 self-center ml-1">+ {pack.countries - 7} autres</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Reglementations</p>
                        <div className="flex flex-wrap gap-1.5">
                          {pack.regulations.map((r) => (
                            <Badge key={r} variant="outline" className="text-xs border-slate-700 text-slate-400 bg-slate-800/50">
                              {r}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ─── 8.2 ─── */}
          <TabsContent value="langues">
            <div className="mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">
                    8.2 Multi-Langues et Support RTL
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Infrastructure next-intl avec support complet droite-a-gauche
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">50+ langues au lancement</Badge>
                  <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-xs">80 d&apos;ici 2028</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {languageSamples.map((lang, i) => (
                <motion.div key={lang.code} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className={`bg-slate-900 border-slate-800 ${lang.dir === 'RTL' ? 'border-l-2 border-l-amber-500/50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-400 uppercase">
                          {lang.code}
                        </Badge>
                        {lang.dir === 'RTL' && (
                          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                            RTL
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-200 mb-1">{lang.lang}</p>
                      <p className={`text-xs text-slate-400 ${lang.dir === 'RTL' ? 'text-right font-arabic' : ''}`} dir={lang.dir.toLowerCase() as 'rtl' | 'ltr'}>
                        {lang.sample}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ─── 8.3 ─── */}
          <TabsContent value="paiements">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                8.3 Devises et Methodes de Paiement
              </h3>
              <p className="text-slate-400 text-sm">
                135+ devises via Stripe avec methodes de paiement locales par region
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentRegions.map((region, i) => (
                <motion.div key={region.region} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                          {region.icon}
                        </div>
                        <CardTitle className="text-base text-slate-200">{region.region}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {region.methods.map((method) => (
                          <div
                            key={method.name}
                            className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50"
                          >
                            <span className="text-cyan-400">{method.icon}</span>
                            <span className="text-xs text-slate-300">{method.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
