'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Star,
  Heart,
  MessageCircle,
  MapPin,
  Wrench,
  Car,
  Shield,
  ClipboardCheck,
  Truck,
  Package,
  Cog,
  Building2,
  User,
  Filter,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

// ─── Types ───────────────────────────────────────────────────
interface Service {
  id: number
  title: string
  category: Category
  rating: number
  reviews: number
  price: string
  location: string
  icon: React.ReactNode
  gradient: string
}

type Category =
  | 'Tous'
  | 'Garages'
  | 'Mécaniciens'
  | 'Pièces détachées'
  | 'Dépannage'
  | 'Assurances'
  | 'Contrôle technique'
  | 'Location'
  | 'Accessoires'

// ─── Categories ──────────────────────────────────────────────
const CATEGORIES: Category[] = [
  'Tous', 'Garages', 'Mécaniciens', 'Pièces détachées',
  'Dépannage', 'Assurances', 'Contrôle technique', 'Location', 'Accessoires',
]

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Tous': <Package className="h-4 w-4" />,
  'Garages': <Building2 className="h-4 w-4" />,
  'Mécaniciens': <Wrench className="h-4 w-4" />,
  'Pièces détachées': <Cog className="h-4 w-4" />,
  'Dépannage': <Truck className="h-4 w-4" />,
  'Assurances': <Shield className="h-4 w-4" />,
  'Contrôle technique': <ClipboardCheck className="h-4 w-4" />,
  'Location': <Car className="h-4 w-4" />,
  'Accessoires': <Package className="h-4 w-4" />,
}

// ─── Mock Service Data ───────────────────────────────────────
const SERVICES: Service[] = [
  { id: 1, title: 'Garage Central Bamako', category: 'Garages', rating: 4.8, reviews: 124, price: 'Sur devis', location: 'Bamako, ACI 2000', icon: <Building2 className="h-8 w-8" />, gradient: 'from-emerald-600/20 to-emerald-800/20' },
  { id: 2, title: 'Mamadou Mécanique', category: 'Mécaniciens', rating: 4.6, reviews: 89, price: '15 000 FCFA/h', location: 'Bamako, Badalabougou', icon: <Wrench className="h-8 w-8" />, gradient: 'from-blue-600/20 to-blue-800/20' },
  { id: 3, title: 'Auto Parts Mali', category: 'Pièces détachées', rating: 4.3, reviews: 56, price: 'Variable', location: 'Bamako, Baco Djicoroni', icon: <Cog className="h-8 w-8" />, gradient: 'from-orange-600/20 to-orange-800/20' },
  { id: 4, title: 'Dépannage 24/7', category: 'Dépannage', rating: 4.9, reviews: 201, price: '25 000 FCFA', location: 'Bamako — toute la ville', icon: <Truck className="h-8 w-8" />, gradient: 'from-red-600/20 to-red-800/20' },
  { id: 5, title: 'NSIA Assurance Auto', category: 'Assurances', rating: 4.2, reviews: 67, price: 'À partir de 35 000 FCFA/an', location: 'Bamako, Hamdallaye', icon: <Shield className="h-8 w-8" />, gradient: 'from-purple-600/20 to-purple-800/20' },
  { id: 6, title: 'Centre de Contrôle Technique', category: 'Contrôle technique', rating: 4.5, reviews: 143, price: '10 000 FCFA', location: 'Bamako, Kalaban-Coura', icon: <ClipboardCheck className="h-8 w-8" />, gradient: 'from-yellow-600/20 to-yellow-800/20' },
  { id: 7, title: 'Location Voitures Mali', category: 'Location', rating: 4.7, reviews: 92, price: '15 000 FCFA/jour', location: 'Bamako, Lafiabougou', icon: <Car className="h-8 w-8" />, gradient: 'from-teal-600/20 to-teal-800/20' },
  { id: 8, title: 'Accessoires Auto Plus', category: 'Accessoires', rating: 4.4, reviews: 78, price: 'Variable', location: 'Bamako, Sébenikoro', icon: <Package className="h-8 w-8" />, gradient: 'from-pink-600/20 to-pink-800/20' },
  { id: 9, title: 'Garage Express Kati', category: 'Garages', rating: 4.1, reviews: 45, price: 'Sur devis', location: 'Kati', icon: <Building2 className="h-8 w-8" />, gradient: 'from-cyan-600/20 to-cyan-800/20' },
  { id: 10, title: 'Ibrahim Diagnostic Auto', category: 'Mécaniciens', rating: 4.7, reviews: 112, price: '20 000 FCFA', location: 'Bamako, Djicoroni Para', icon: <Wrench className="h-8 w-8" />, gradient: 'from-indigo-600/20 to-indigo-800/20' },
  { id: 11, title: 'SUNU Assurances', category: 'Assurances', rating: 4.0, reviews: 38, price: 'À partir de 28 000 FCFA/an', location: 'Bamako, Quartier du Fleuve', icon: <Shield className="h-8 w-8" />, gradient: 'from-violet-600/20 to-violet-800/20' },
  { id: 12, title: 'Dépannage Rapide Mali', category: 'Dépannage', rating: 4.5, reviews: 76, price: '20 000 FCFA', location: 'Koulikoro', icon: <Truck className="h-8 w-8" />, gradient: 'from-amber-600/20 to-amber-800/20' },
]

// ─── Animation wrapper ───────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

// ─── Stars component ─────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-slate-700'
          }`}
        />
      ))}
      <span className="text-slate-400 text-xs ml-1">({rating})</span>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function MarketplaceModule() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tous')
  const [tab, setTab] = useState('marketplace')
  const [favorites, setFavorites] = useState<number[]>([]
)
  const [searchFilters, setSearchFilters] = useState({
    category: 'Tous' as Category,
    priceMin: '',
    priceMax: '',
    ratingMin: '0',
  })

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  // Filtered services for marketplace tab
  const filteredByCategory = useMemo(() => {
    return SERVICES.filter(s => {
      const matchCategory = selectedCategory === 'Tous' || s.category === selectedCategory
      const matchSearch = searchQuery === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [selectedCategory, searchQuery])

  // Filtered for search tab
  const filteredByAdvanced = useMemo(() => {
    return SERVICES.filter(s => {
      const matchCategory = searchFilters.category === 'Tous' || s.category === searchFilters.category
      const matchSearch = searchQuery === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchRating = s.rating >= parseInt(searchFilters.ratingMin)
      return matchCategory && matchSearch && matchRating
    })
  }, [searchFilters, searchQuery])

  const favoriteServices = useMemo(() => {
    return SERVICES.filter(s => favorites.includes(s.id))
  }, [favorites])

  return (
    <div className="pt-16 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── HEADER ──────────────────────────────────────── */}
        <motion.div {...fadeUp} className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Package className="h-8 w-8 text-emerald-500" />
            Marketplace
          </h1>
          <p className="text-slate-400 mt-1">Trouvez les meilleurs services automobiles près de chez vous</p>
        </motion.div>

        {/* ── SEARCH BAR ──────────────────────────────────── */}
        <motion.div {...fadeUp} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un service, garage, mécanicien..."
                className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 h-11"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Select value={selectedCategory} onValueChange={(v: string) => setSelectedCategory(v as Category)}>
              <SelectTrigger className="w-full sm:w-52 bg-slate-900 border-slate-800 text-white h-11">
                <SlidersHorizontal className="h-4 w-4 mr-2 text-emerald-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 max-h-80 overflow-y-auto">
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-slate-200 focus:bg-slate-800 focus:text-white">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* ── MAIN TABS ───────────────────────────────────── */}
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 h-auto flex flex-wrap gap-1">
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5">
              <Package className="h-4 w-4" /> Marketplace
            </TabsTrigger>
            <TabsTrigger value="recherche" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5">
              <Filter className="h-4 w-4" /> Recherche
            </TabsTrigger>
            <TabsTrigger value="favoris" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5 relative">
              <Heart className="h-4 w-4" /> Favoris
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── TAB: MARKETPLACE ──────────────────────────── */}
          <TabsContent value="marketplace">
            <motion.div {...fadeUp}>
              {/* Category pills for mobile-friendly selection */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {CATEGORY_ICONS[cat]}
                    {cat}
                  </button>
                ))}
              </div>

              {/* Service count */}
              <p className="text-slate-500 text-sm mb-4">
                {filteredByCategory.length} service{filteredByCategory.length !== 1 ? 's' : ''} trouvé{filteredByCategory.length !== 1 ? 's' : ''}
              </p>

              {/* Service grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredByCategory.map((service, i) => (
                    <motion.div
                      key={service.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      <ServiceCard
                        service={service}
                        isFavorite={favorites.includes(service.id)}
                        onToggleFavorite={() => toggleFavorite(service.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredByCategory.length === 0 && (
                <div className="text-center py-16">
                  <Search className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500">Aucun service trouvé</p>
                  <p className="text-slate-600 text-sm mt-1">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* ── TAB: RECHERCHE ────────────────────────────── */}
          <TabsContent value="recherche">
            <motion.div {...fadeUp} className="space-y-6">
              {/* Advanced filters */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-emerald-500" />
                    Filtres avancés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs">Catégorie</label>
                      <Select value={searchFilters.category} onValueChange={(v: string) => setSearchFilters(p => ({ ...p, category: v as Category }))}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat} className="text-slate-200">{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs">Note minimum</label>
                      <Select value={searchFilters.ratingMin} onValueChange={v => setSearchFilters(p => ({ ...p, ratingMin: v }))}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="0" className="text-slate-200">Toutes les notes</SelectItem>
                          <SelectItem value="3" className="text-slate-200">3+ étoiles</SelectItem>
                          <SelectItem value="4" className="text-slate-200">4+ étoiles</SelectItem>
                          <SelectItem value="4.5" className="text-slate-200">4.5+ étoiles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs">Prix min (FCFA)</label>
                      <Input
                        value={searchFilters.priceMin}
                        onChange={e => setSearchFilters(p => ({ ...p, priceMin: e.target.value }))}
                        placeholder="0"
                        type="number"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs">Prix max (FCFA)</label>
                      <Input
                        value={searchFilters.priceMax}
                        onChange={e => setSearchFilters(p => ({ ...p, priceMax: e.target.value }))}
                        placeholder="Pas de limite"
                        type="number"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results count */}
              <p className="text-slate-500 text-sm">
                {filteredByAdvanced.length} résultat{filteredByAdvanced.length !== 1 ? 's' : ''}
              </p>

              {/* Results list */}
              <div className="space-y-3">
                {filteredByAdvanced.map((service, i) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                      <CardContent className="py-4 px-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-emerald-400 shrink-0`}>
                            {service.icon}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-medium text-sm truncate">{service.title}</h3>
                              <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px] shrink-0" variant="outline">
                                {service.category}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {service.location}</span>
                              <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400" /> {service.rating} ({service.reviews} avis)</span>
                              <span className="text-emerald-400 font-medium">{service.price}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-1"
                            >
                              <MessageCircle className="h-3.5 w-3.5" /> Contacter
                            </Button>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                              Voir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredByAdvanced.length === 0 && (
                <div className="text-center py-16">
                  <Filter className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500">Aucun résultat trouvé</p>
                  <p className="text-slate-600 text-sm mt-1">Ajustez vos filtres pour trouver un service</p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* ── TAB: FAVORIS ──────────────────────────────── */}
          <TabsContent value="favoris">
            <motion.div {...fadeUp}>
              <p className="text-slate-500 text-sm mb-6">
                {favoriteServices.length} service{favoriteServices.length !== 1 ? 's' : ''} en favori{favoriteServices.length !== 1 ? 's' : ''}
              </p>

              {favoriteServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {favoriteServices.map((service, i) => (
                      <motion.div
                        key={service.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                      >
                        <ServiceCard
                          service={service}
                          isFavorite={true}
                          onToggleFavorite={() => toggleFavorite(service.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-slate-700" />
                  </div>
                  <h3 className="text-white font-medium mb-1">Aucun favori</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Explorez le marketplace et ajoutez des services à vos favoris pour les retrouver facilement.
                  </p>
                  <Button
                    onClick={() => setTab('marketplace')}
                    className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  >
                    <Search className="h-4 w-4" /> Explorer le marketplace
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERVICE CARD COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ServiceCard({ service, isFavorite, onToggleFavorite }: {
  service: Service
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all overflow-hidden group">
      {/* Image placeholder with gradient */}
      <div className={`relative h-32 bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
        <div className="text-emerald-400/60 group-hover:text-emerald-400 transition-colors">
          {service.icon}
        </div>
        {/* Favorite button */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-900/60 backdrop-blur-sm hover:bg-slate-900/80 transition-colors"
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart className={`h-4 w-4 transition-colors ${isFavorite ? 'text-red-400 fill-red-400' : 'text-slate-400'}`} />
        </button>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-medium text-sm truncate">{service.title}</h3>
          <Badge className="mt-1.5 bg-emerald-500/10 text-emerald-400 border-0 text-[10px]" variant="outline">
            {service.category}
          </Badge>
        </div>

        <Stars rating={service.rating} />

        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{service.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-emerald-400 font-semibold text-sm">{service.price}</span>
        </div>

        <Separator className="bg-slate-800" />

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-1 h-8 text-xs"
          >
            <MessageCircle className="h-3 w-3" /> Contacter
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
          >
            Voir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
