import ImmersiveRoadSigns from '@/components/learning/ImmersiveRoadSigns';

export const metadata = {
  title: 'Atlas immersif de signalisation | ADSO',
  description: 'Apprendre les panneaux par le visuel, le contexte et des cas pratiques immersifs.',
};

async function getSigns() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  try {
    const response = await fetch(`${baseUrl}/api/learning/signs?countryCode=ZZ`, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    const data = await response.json();
    return data.signs || [];
  } catch {
    return [];
  }
}

export default async function SignalisationPage() {
  const signs = await getSigns();
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">ADSO Road Signs Atlas</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Voir. Comprendre. Décider.</h1>
          <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">Un atlas visuel enrichi pour apprendre la signalisation, puis s’entraîner dans des situations proches de la conduite réelle.</p>
        </header>
        <ImmersiveRoadSigns signs={signs} />
      </div>
    </main>
  );
}
