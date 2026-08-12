import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getUserId, getUserRole } from '@/lib/auth';

const ROLE_CONFIG: Record<string, { label: string; objective: string; modules: string[] }> = {
  student: {
    label: 'Cockpit Élève',
    objective: 'Réussir votre permis avec un parcours personnalisé.',
    modules: ['Parcours', 'Révisions intelligentes', 'Examens blancs', 'Journal', 'Coach IA'],
  },
  driver: {
    label: 'Cockpit Conducteur',
    objective: 'Améliorer votre conduite, votre sécurité et votre maîtrise du véhicule.',
    modules: ['Conduite', 'Sécurité', 'Véhicule', 'Journal', 'Performance'],
  },
  instructor: {
    label: 'Cockpit Instructeur',
    objective: 'Piloter les progrès des apprenants et optimiser l’accompagnement.',
    modules: ['Élèves', 'Progression', 'Évaluations', 'Contenus', 'Rapports'],
  },
  mechanic: {
    label: 'Cockpit Mécanicien',
    objective: 'Diagnostiquer, prioriser et suivre les interventions véhicule.',
    modules: ['Diagnostics', 'Véhicules', 'Interventions', 'Pièces', 'Historique'],
  },
  insurer: {
    label: 'Cockpit Assureur',
    objective: 'Piloter le risque, les contrats et les sinistres avec des données fiables.',
    modules: ['Portefeuille', 'Sinistres', 'Risque', 'Fraude', 'Rapports'],
  },
  fleet_manager: {
    label: 'Cockpit Gestionnaire de flotte',
    objective: 'Réduire les coûts et améliorer la sécurité de la flotte.',
    modules: ['Flotte', 'Conducteurs', 'Maintenance', 'Carburant', 'Sécurité'],
  },
  admin: {
    label: 'Cockpit Administrateur',
    objective: 'Piloter ADSO, ses utilisateurs, ses contenus et sa performance.',
    modules: ['Utilisateurs', 'Contenus', 'Analytics', 'Sécurité', 'Revenus'],
  },
  super_admin: {
    label: 'Cockpit Super Administrateur',
    objective: 'Gouverner l’ensemble de l’écosystème ADSO.',
    modules: ['Gouvernance', 'Analytics', 'Sécurité', 'Revenus', 'Infrastructure'],
  },
};

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;

  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });

  const role = getUserRole(session);
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.student;

  const [user, progressCount, completedCount, quizCount, avgScore, certifications, journal] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, country: true, language: true, subscription: true, createdAt: true },
    }),
    db.studentProgress.count({ where: { userId } }),
    db.studentProgress.count({ where: { userId, status: 'completed' } }),
    db.quizAttempt.count({ where: { userId } }),
    db.quizAttempt.aggregate({ where: { userId }, _avg: { score: true } }),
    db.certification.count({ where: { userId } }),
    db.analyticsEvent.findMany({
      where: { userId, eventType: 'journal_entry' },
      orderBy: { createdAt: 'desc' },
      take: 12,
      select: { id: true, metadata: true, createdAt: true },
    }),
  ]);

  if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

  let roleMetrics: Record<string, unknown> = {};
  if (role === 'driver') {
    const [sessions, distance] = await Promise.all([
      db.drivingSession.count({ where: { userId } }),
      db.drivingSession.aggregate({ where: { userId }, _sum: { distance: true } }),
    ]);
    roleMetrics = { drivingSessions: sessions, distanceKm: Math.round((distance._sum.distance ?? 0) * 10) / 10 };
  } else if (role === 'mechanic') {
    const diagnostics = await db.diagnosticRecord.count({ where: { userId } });
    roleMetrics = { diagnostics };
  } else if (role === 'fleet_manager') {
    const drivers = await db.fleetDriver.count({ where: { userId } });
    const maintenance = await db.maintenanceRecord.count({ where: { userId } });
    roleMetrics = { fleetDrivers: drivers, maintenanceRecords: maintenance };
  } else if (role === 'insurer') {
    const [policies, claims] = await Promise.all([
      db.insurancePolicy.count({ where: { userId } }),
      db.insuranceClaim.count({ where: { userId } }),
    ]);
    roleMetrics = { policies, claims };
  }

  const journalEntries = journal.map((entry) => {
    try {
      const data = JSON.parse(entry.metadata) as Record<string, unknown>;
      return { id: entry.id, title: typeof data.title === 'string' ? data.title : 'Note', body: typeof data.body === 'string' ? data.body : '', mood: typeof data.mood === 'string' ? data.mood : null, createdAt: entry.createdAt };
    } catch {
      return { id: entry.id, title: 'Note', body: entry.metadata, mood: null, createdAt: entry.createdAt };
    }
  });

  return NextResponse.json({
    user,
    cockpit: config,
    metrics: {
      activeCourses: progressCount,
      completedCourses: completedCount,
      quizzes: quizCount,
      averageScore: Math.round((avgScore._avg.score ?? 0) * 10) / 10,
      certifications,
      ...roleMetrics,
    },
    journal: journalEntries,
  });
}
