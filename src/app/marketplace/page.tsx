import Link from 'next/link'
import MarketplaceModule from '@/components/modules/MarketplaceModule'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-4">
          <div>
            <p className="text-sm font-semibold text-emerald-400">ADSO Marketplace</p>
            <p className="text-sm text-slate-400">Services automobiles et publications numériques ADSO.</p>
          </div>
          <Link
            href="/ebooks"
            className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            📚 Ouvrir la Marketplace eBooks
          </Link>
        </div>
      </div>
      <MarketplaceModule />
    </div>
  )
}
