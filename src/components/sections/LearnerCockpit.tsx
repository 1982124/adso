'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock3, PlayCircle, RefreshCw, ShieldCheck, Target, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLocaleStore } from '@/stores/locale-store';

interface Module { id: string; title: string; type: string; duration: number; }
interface Course { id: string; title: string; description: string; category: string; level: string; duration: number; isPremium: boolean; modules: Module[]; studentProgress?: { progress: number } | null; }
const levelLabel: Record<string, string> = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' };

export default function LearnerCockpit() {
  const router = useRouter();
  const { country } = useLocaleStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoading(true); setError(false);
    const countryCode = country.code?.trim().toUpperCase();
    if (!countryCode) { setCourses([]); setLoading(false); return () => controller.abort(); }
    fetch(`/api/courses?countryCode=${encodeURIComponent(countryCode)}`, { cache: 'no-store', signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('catalogue'); return response.json() as Promise<Course[]>; })
      .then((data) => { if (active) setCourses(Array.isArray(data) ? data : []); })
      .catch((cause: unknown) => { if (cause instanceof DOMException && cause.name === 'AbortError') return; if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [country.code, retry]);

  const stats = useMemo(() => {
    const modules = courses.reduce((sum, course) => sum + course.modules.length, 0);
    const minutes = courses.reduce((sum, course) => sum + course.duration, 0);
    const quizzes = courses.reduce((sum, course) => sum + course.modules.filter((module) => module.type === 'quiz').length, 0);
    const progressCourses = courses.filter((course) => (course.studentProgress?.progress ?? 0) > 0);
    const progress = progressCourses.length ? Math.round(progressCourses.reduce((sum, course) => sum + (course.studentProgress?.progress ?? 0), 0) / progressCourses.length) : 0;
    return { modules, minutes, quizzes, progress };
  }, [courses]);

  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 lg:py-14" aria-label="Cockpit apprenant">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="overflow-hidden border-0 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100">Cockpit apprenant</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Votre prochaine action est déjà devant vous.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">Parcourez les cours ADSO, ouvrez les modules et construisez des preuves de compétence, étape après étape.</p></div><div className="rounded-2xl bg-white/10 p-4 backdrop-blur"><p className="text-xs text-emerald-100">Progression enregistrée</p><p className="mt-1 text-3xl font-bold">{stats.progress}%</p></div></div>
          </div>
          <CardContent className="space-y-7 p-5 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[{ icon: BookOpen, label: 'Cours disponibles', value: courses.length },{ icon: Target, label: 'Modules pédagogiques', value: stats.modules },{ icon: Clock3, label: 'Minutes de formation', value: stats.minutes },{ icon: Trophy, label: 'Quiz intégrés', value: stats.quizzes }].map(({ icon: Icon, label, value }) => <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><Icon className="h-5 w-5 text-emerald-600"/><p className="mt-3 text-2xl font-bold text-slate-900">{loading ? '—' : value}</p><p className="text-xs text-slate-500">{label}</p></div>)}</div>
            <div className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-700"/><h3 className="font-semibold text-slate-900">Pays sélectionné</h3></div><p className="mt-1 text-sm text-slate-600">{country.name || 'Aucun pays sélectionné'}</p></div><Button className="shrink-0 bg-emerald-700 text-white hover:bg-emerald-800" onClick={() => document.getElementById('adso-course-catalog')?.scrollIntoView({ behavior: 'smooth' })}>Explorer les cours</Button></div>
            <div id="adso-course-catalog"><div className="mb-4 flex items-center justify-between gap-4"><div><h3 className="text-xl font-bold text-slate-900">Catalogue ADSO — {country.name || 'pays non sélectionné'}</h3><p className="text-sm text-slate-500">Contenus pédagogiques versionnés, servis uniquement pour le pays sélectionné.</p></div><Badge variant="outline" className="hidden sm:inline-flex">Contenu réel</Badge></div>
              {error ? <div className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Le catalogue n'a pas pu être chargé.</p><p className="mt-1 text-red-600">ADSO reste ouvert : vous pouvez relancer le chargement sans perdre votre parcours.</p></div><Button variant="outline" className="shrink-0 gap-2 border-red-200 bg-white text-red-700 hover:bg-red-100" onClick={() => setRetry((value) => value + 1)}><RefreshCw className="h-4 w-4"/> Réessayer</Button></div>
              : loading ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-live="polite" aria-busy="true">{[1,2,3].map((item) => <div key={item} className="h-48 animate-pulse rounded-2xl bg-slate-100"/>)}</div>
              : courses.length === 0 ? <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center"><BookOpen className="mx-auto h-8 w-8 text-emerald-600"/><h4 className="mt-3 font-semibold text-slate-900">Votre parcours local est en préparation</h4><p className="mt-1 text-sm text-slate-600">ADSO n'invente pas de réglementation locale. En attendant la publication de contenus validés pour {country.name || 'votre pays'}, vous pouvez découvrir les ressources générales et préparer votre parcours.</p><Button variant="outline" className="mt-4 gap-2 bg-white" onClick={() => router.push('/education')}><BookOpen className="h-4 w-4"/> Découvrir l’éducation routière</Button></div>
              : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{courses.map((course) => { const progress = course.studentProgress?.progress ?? 0; return <Card key={course.id} className="border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><CardContent className="flex h-full flex-col p-5"><div className="flex items-start justify-between gap-3"><Badge variant="outline">{levelLabel[course.level] ?? course.level}</Badge>{course.isPremium && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Premium</Badge>}</div><h4 className="mt-4 text-base font-bold text-slate-900">{course.title}</h4><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{course.description}</p><div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>{course.duration} min</span><span>{course.modules.length} modules</span></div><div className="mt-4 space-y-2"><div className="flex justify-between text-xs font-medium text-slate-500"><span>Progression</span><span>{Math.round(progress)}%</span></div><Progress value={progress} className="h-1.5"/></div><div className="mt-5 space-y-2">{course.modules.slice(0,3).map((module) => <div key={module.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"><span className="truncate pr-3 text-slate-700">{module.title}</span><span className="shrink-0 text-slate-400">{module.duration} min</span></div>)}</div><Button variant="outline" className="mt-5 w-full gap-2" onClick={() => router.push(`/?course=${encodeURIComponent(course.id)}`)}><PlayCircle className="h-4 w-4"/> {progress > 0 ? 'Reprendre le parcours' : 'Ouvrir le parcours'}</Button></CardContent></Card>; })}</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
