'use client';

import { useEffect, useState } from 'react';

interface Book { id: string; title: string; slug: string; author: string; isPublished: boolean; }
interface Collection { id: string; title: string; slug: string; status: string; items: { ebookId: string; title: string }[]; contributors: { name: string; role: string }[]; }

export default function AdminEbookCollectionsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [contributors, setContributors] = useState([{ name: '', email: '', role: 'author' }]);
  const [message, setMessage] = useState('');

  async function load() {
    const [b, c] = await Promise.all([fetch('/api/ebooks'), fetch('/api/admin/ebooks/collections')]);
    const bd = await b.json(); const cd = await c.json();
    setBooks((bd.ebooks || []).filter((x: Book) => x.isPublished));
    setCollections(cd.collections || []);
  }
  useEffect(() => { load(); }, []);

  async function createCollection() {
    setMessage('');
    const res = await fetch('/api/admin/ebooks/collections', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title, description, targetAudience, ebookIds: selected, contributors }) });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || 'Erreur');
    setMessage(`Collection créée : /ebooks/collections/${data.slug}`); setTitle(''); setDescription(''); setTargetAudience(''); setSelected([]); setContributors([{ name: '', email: '', role: 'author' }]); load();
  }

  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"><div className="mx-auto max-w-5xl"><p className="text-sm opacity-60">ADSO · Administration</p><h1 className="mt-2 text-3xl font-bold">Collections & packs de livres</h1><p className="mt-2 opacity-75">Créez une collection commerciale ou éditoriale regroupant plusieurs eBooks, avec plusieurs auteurs/co-auteurs.</p>
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"><h2 className="text-xl font-semibold">Nouvelle collection</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><input className="rounded-xl bg-white/10 p-3" placeholder="Nom de la collection" value={title} onChange={e=>setTitle(e.target.value)} /><input className="rounded-xl bg-white/10 p-3" placeholder="Public cible" value={targetAudience} onChange={e=>setTargetAudience(e.target.value)} /><textarea className="rounded-xl bg-white/10 p-3 md:col-span-2" rows={4} placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} /></div>
      <h3 className="mt-6 font-semibold">Livres de la collection</h3><div className="mt-2 grid gap-2">{books.map(book=><label key={book.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3"><input type="checkbox" checked={selected.includes(book.id)} onChange={e=>setSelected(v=>e.target.checked?[...v,book.id]:v.filter(id=>id!==book.id))}/><span>{book.title} — {book.author}</span></label>)}</div>
      <h3 className="mt-6 font-semibold">Auteurs / co-auteurs de la collection</h3>{contributors.map((c,i)=><div key={i} className="mt-2 grid gap-2 md:grid-cols-3"><input className="rounded-xl bg-white/10 p-3" placeholder="Nom" value={c.name} onChange={e=>setContributors(v=>v.map((x,j)=>j===i?{...x,name:e.target.value}:x))}/><input className="rounded-xl bg-white/10 p-3" placeholder="Email" value={c.email} onChange={e=>setContributors(v=>v.map((x,j)=>j===i?{...x,email:e.target.value}:x))}/><select className="rounded-xl bg-white/10 p-3" value={c.role} onChange={e=>setContributors(v=>v.map((x,j)=>j===i?{...x,role:e.target.value}:x))}><option value="author">Auteur</option><option value="coauthor">Co-auteur</option><option value="editor">Éditeur</option></select></div>)}<button className="mt-3 text-left text-sm underline" onClick={()=>setContributors(v=>[...v,{name:'',email:'',role:'coauthor'}])}>+ Ajouter un contributeur</button>
      <button disabled={!title||!description||selected.length===0} onClick={createCollection} className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 disabled:opacity-40">Créer la collection</button>{message && <p className="mt-4 text-sm">{message}</p>}</section>
    <section className="mt-8"><h2 className="text-xl font-semibold">Collections existantes</h2><div className="mt-3 grid gap-3">{collections.map(c=><div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-4"><strong>{c.title}</strong><span className="ml-3 text-xs opacity-60">{c.status}</span><p className="text-sm opacity-70">{c.items?.length || 0} livre(s) · {c.contributors?.map(x=>x.name).join(', ')}</p><a className="text-sm underline" href={`/ebooks/collections/${c.slug}`} target="_blank">Voir la page publique</a></div>)}</div></section>
  </div></main>;
}
