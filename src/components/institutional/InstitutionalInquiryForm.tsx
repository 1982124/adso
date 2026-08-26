'use client';

import { FormEvent, useState } from 'react';

const institutionTypes = [
  'institution publique',
  'école',
  'université',
  'centre de formation',
  'entreprise',
  'ong / association',
  'collectivité',
  'autre',
];

export default function InstitutionalInquiryForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError('');

    const form = new FormData(event.currentTarget);
    const payload = {
      country: form.get('country'),
      institution: form.get('institution'),
      institutionType: form.get('institutionType'),
      role: form.get('role'),
      interest: form.get('interest'),
      population: form.get('population'),
      language: form.get('language'),
      contact: form.get('contact'),
      message: form.get('message'),
      website: form.get('website'),
      consent: form.get('consent') === 'on',
    };

    try {
      const response = await fetch('/api/institutional/inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'La demande n’a pas pu être envoyée.');
      setStatus('success');
      event.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/[0.08] p-7 sm:p-10" role="status">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Demande reçue</p>
        <h3 className="mt-3 text-2xl font-black">Merci. Votre demande a été transmise à ADSO AFRICA.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Elle est enregistrée pour examen et qualification. Une relation avec ADSO AFRICA n’est considérée comme un partenariat qu’après accord formel.</p>
        <button type="button" onClick={() => setStatus('idle')} className="mt-6 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold hover:bg-white/10">Envoyer une autre demande</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8" aria-describedby="institutional-form-note">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">Pays<input required name="country" maxLength={80} className="min-h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-emerald-400" placeholder="Ex. Mali" /></label>
        <label className="grid gap-2 text-sm font-semibold">Institution<input required name="institution" maxLength={180} className="min-h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-emerald-400" placeholder="Nom de l’institution" /></label>
        <label className="grid gap-2 text-sm font-semibold">Type<select required name="institutionType" defaultValue="" className="min-h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-emerald-400"><option value="" disabled>Sélectionner</option>{institutionTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-semibold">Votre fonction<input required name="role" maxLength={120} className="min-h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-emerald-400" placeholder="Ex. responsable formation" /></label>
        <label className="grid gap-2 text-sm font-semibold md:col-span-2">Sujet d’intérêt<input required name="interest" maxLength={180} className="min-h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-emerald-400" placeholder="Ex. programme de mobilité pour étudiants" /></label>
        <label className="grid gap-2 text-sm font-semibold">Public concerné<input name="population" maxLength={180} className="min-h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-emerald-400" placeholder="Ex. 2 000 étudiants" /></label>
        <label className="grid gap-2 text-sm font-semibold">Langue souhaitée<input name="language" maxLength={40} className="min-h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-emerald-400" placeholder="Français, anglais…" /></label>
        <label className="grid gap-2 text-sm font-semibold md:col-span-2">Contact professionnel<input required name="contact" maxLength={180} className="min-h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-emerald-400" placeholder="E-mail ou moyen de contact professionnel" /></label>
        <label className="grid gap-2 text-sm font-semibold md:col-span-2">Votre besoin / contexte<textarea required name="message" maxLength={1200} rows={5} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" placeholder="Décrivez brièvement votre besoin ou le contexte de votre démarche." /></label>
        <div className="hidden" aria-hidden="true"><label>Site web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-slate-300"><input required name="consent" type="checkbox" className="mt-1 size-4 accent-emerald-500" />J’accepte que les informations fournies soient utilisées pour traiter cette demande institutionnelle.</label>
      <p id="institutional-form-note" className="mt-4 text-xs leading-5 text-slate-400">ADSO AFRICA ne présente pas une demande comme un partenariat et ne prétend aucune affiliation sans accord formel.</p>
      {status === 'error' && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
      <button disabled={status === 'sending'} type="submit" className="mt-6 min-h-12 rounded-xl bg-emerald-400 px-6 py-3 font-extrabold text-slate-950 disabled:cursor-wait disabled:opacity-60">{status === 'sending' ? 'Envoi…' : 'Proposer un échange avec ADSO AFRICA'}</button>
    </form>
  );
}
