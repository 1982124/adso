import { NextRequest, NextResponse } from 'next/server'

// Feature flags are stored in-memory for now (no DB model)
const featureFlags: Array<{
  id: string
  name: string
  description: string
  key: string
  enabled: boolean
  targetAudience: string[]
  category: string
  createdAt: string
}> = [
  {
    id: 'ff-1',
    name: 'IA Coach de Conduite',
    description: 'Active le coach IA en temps réel pendant les sessions de conduite',
    key: 'ai_driving_coach',
    enabled: true,
    targetAudience: ['pro', 'premium'],
    category: 'IA',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'ff-2',
    name: 'Diagnostic Mécanique IA',
    description: 'Permet l\'analyse des symptômes mécaniques par IA multimodale',
    key: 'ai_mechanic_diagnostic',
    enabled: true,
    targetAudience: ['starter', 'pro', 'premium'],
    category: 'IA',
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'ff-3',
    name: 'Tableau de Bord Flotte',
    description: 'Accès au module complet de gestion de flotte',
    key: 'fleet_dashboard',
    enabled: true,
    targetAudience: ['enterprise'],
    category: 'Flotte',
    createdAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'ff-4',
    name: 'Platforme Gouvernementale',
    description: 'Module de gestion des infractions et inspections',
    key: 'government_platform',
    enabled: false,
    targetAudience: ['enterprise'],
    category: 'Gouvernement',
    createdAt: '2025-03-15T10:00:00Z',
  },
  {
    id: 'ff-5',
    name: 'Alertes Sécurité Avancées',
    description: 'Géorepérage, détection de collision et alertes anti-vol',
    key: 'advanced_security_alerts',
    enabled: true,
    targetAudience: ['pro', 'premium'],
    category: 'Sécurité',
    createdAt: '2025-04-01T10:00:00Z',
  },
  {
    id: 'ff-6',
    name: 'Marché Intégré',
    description: 'Accès au marché de services automobiles',
    key: 'marketplace_access',
    enabled: true,
    targetAudience: ['starter', 'pro', 'premium'],
    category: 'Marketplace',
    createdAt: '2025-04-15T10:00:00Z',
  },
  {
    id: 'ff-7',
    name: 'Télémétrie Avancée',
    description: 'Données télémétriques détaillées et analyses prédictives',
    key: 'advanced_telematics',
    enabled: false,
    targetAudience: ['premium'],
    category: 'Télémétrie',
    createdAt: '2025-05-01T10:00:00Z',
  },
  {
    id: 'ff-8',
    name: 'Examens Adaptatifs IA',
    description: 'Examens de conduite adaptatifs basés sur le niveau de l\'élève',
    key: 'adaptive_exams',
    enabled: true,
    targetAudience: ['pro', 'premium'],
    category: 'Formation',
    createdAt: '2025-05-15T10:00:00Z',
  },
]

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: featureFlags })
  } catch (error) {
    console.error('[GET /api/enterprise/feature-flags] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des feature flags' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { flagId, enabled } = body

    if (!flagId || enabled === undefined) {
      return NextResponse.json(
        { error: 'flagId et enabled sont requis' },
        { status: 400 }
      )
    }

    const flag = featureFlags.find((f) => f.id === flagId)
    if (!flag) {
      return NextResponse.json(
        { error: 'Feature flag non trouvé' },
        { status: 404 }
      )
    }

    flag.enabled = enabled
    return NextResponse.json({ success: true, data: flag })
  } catch (error) {
    console.error('[POST /api/enterprise/feature-flags] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du feature flag' },
      { status: 500 }
    )
  }
}
