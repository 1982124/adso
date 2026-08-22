import { NextResponse } from "next/server";
import { getSession, getUserRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasMinRole } from "@/lib/rbac";

const PERIODS = { "7d": 7, "30d": 30, "90d": 90 } as const;
type Period = keyof typeof PERIODS;

function startDate(days: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (days - 1));
  return date;
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasMinRole(getUserRole(session), "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const requested = url.searchParams.get("period") as Period | null;
  const period: Period = requested && requested in PERIODS ? requested : "30d";
  const days = PERIODS[period];
  const from = startDate(days);

  const [users, courses, countries, enrollments, certifications, auditLogs, events, attempts, progress, recentEvents] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.country.count(),
    db.enrollment.count(),
    db.certification.count(),
    db.auditLogEntry.count(),
    db.analyticsEvent.count({ where: { createdAt: { gte: from } } }),
    db.quizAttempt.count({ where: { createdAt: { gte: from } } }),
    db.studentProgress.count({ where: { updatedAt: { gte: from } } }),
    db.analyticsEvent.findMany({ orderBy: { createdAt: "desc" }, take: 12, select: { id: true, eventType: true, metadata: true, createdAt: true } }),
  ]);

  const [newUsers, newEnrollments, newCertifications, passedAttempts] = await Promise.all([
    db.user.count({ where: { createdAt: { gte: from } } }),
    db.enrollment.count({ where: { enrolledAt: { gte: from } } }),
    db.certification.count({ where: { issuedAt: { gte: from } } }),
    db.quizAttempt.count({ where: { createdAt: { gte: from }, passed: true } }),
  ]);

  const passRate = attempts ? Math.round((passedAttempts / attempts) * 100) : 0;

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    period,
    days,
    totals: { users, courses, countries, enrollments, certifications, auditLogs },
    activity: { events, newUsers, newEnrollments, newCertifications, attempts, progress, passRate },
    recentEvents,
  }, { headers: { "Cache-Control": "no-store" } });
}
