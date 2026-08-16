import ImmersiveRoadSigns from '@/components/learning/ImmersiveRoadSigns';

export const metadata = {
  title: 'Atlas immersif de signalisation | ADSO',
  description: 'Apprendre les panneaux par le visuel, le contexte et des cas pratiques immersifs.',
};

type Sign = {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  description: string;
  meaning: string;
  useCase: string;
  shape: string;
  colors: string[];
  applicability: 'common';
};

// Safety-net corpus: the learning screen must remain useful even when the
// production database/API is temporarily unavailable. These are pedagogical
// examples and never replace the selected country's official regulations.
const FALLBACK_SIGNS: Sign[] = [
  { id: 'fallback-stop', category: 'Priorité', subcategory: 'Arrêt', name: 'STOP', description: 'Arrêt obligatoire avant de poursuivre.', meaning: 'Le conducteur doit marquer un arrêt et céder le passage selon les règles applicables.', useCase: 'Ralentir à l’approche, s’arrêter à la ligne puis observer avant de repartir.', shape: 'octagon', colors: ['rouge', 'blanc'], applicability: 'common' },
  { id: 'fallback-yield', category: 'Priorité', subcategory: 'Cédez le passage', name: 'Cédez le passage', description: 'Annonce une obligation de céder le passage.', meaning: 'Le conducteur doit laisser passer les usagers prioritaires avant de s’engager.', useCase: 'Réduire l’allure, contrôler les deux directions et céder si nécessaire.', shape: 'triangle-inverse', colors: ['rouge', 'blanc'], applicability: 'common' },
  { id: 'fallback-danger', category: 'Danger', subcategory: 'Avertissement', name: 'Danger général', description: 'Avertit d’un danger dont la nature doit être identifiée.', meaning: 'La présence d’un danger impose une vigilance accrue et une adaptation de l’allure.', useCase: 'Lever le pied, observer et être prêt à réagir.', shape: 'triangle', colors: ['rouge', 'blanc'], applicability: 'common' },
  { id: 'fallback-no-entry', category: 'Interdiction', subcategory: 'Accès', name: 'Sens interdit', description: 'Interdit l’accès dans ce sens.', meaning: 'La voie ne doit pas être empruntée dans la direction indiquée.', useCase: 'Ne pas s’engager et rechercher un itinéraire autorisé.', shape: 'circle', colors: ['rouge', 'blanc'], applicability: 'common' },
  { id: 'fallback-speed', category: 'Interdiction', subcategory: 'Vitesse', name: 'Limitation de vitesse', description: 'Fixe une vitesse maximale selon la valeur affichée.', meaning: 'La vitesse du véhicule ne doit pas dépasser la limite indiquée, sous réserve des règles locales.', useCase: 'Adapter l’allure avant le panneau et maintenir une vitesse compatible avec les conditions.', shape: 'circle', colors: ['rouge', 'blanc'], applicability: 'common' },
  { id: 'fallback-parking', category: 'Interdiction', subcategory: 'Stationnement', name: 'Stationnement interdit', description: 'Signale une interdiction de stationner.', meaning: 'Le stationnement est interdit dans la zone couverte par la signalisation.', useCase: 'Ne pas immobiliser le véhicule pour stationner dans la zone concernée.', shape: 'circle', colors: ['rouge', 'bleu'], applicability: 'common' },
  { id: 'fallback-pedestrian', category: 'Danger', subcategory: 'Usagers vulnérables', name: 'Passage de piétons', description: 'Signale une zone où la présence de piétons doit être anticipée.', meaning: 'Le conducteur doit renforcer sa vigilance envers les piétons et appliquer les règles de priorité locales.', useCase: 'Ralentir, regarder les abords et être prêt à s’arrêter.', shape: 'triangle', colors: ['rouge', 'blanc'], applicability: 'common' },
  { id: 'fallback-roundabout', category: 'Priorité', subcategory: 'Intersection', name: 'Carrefour à sens giratoire', description: 'Annonce une intersection aménagée en giratoire.', meaning: 'Le conducteur doit préparer son entrée et respecter la signalisation de priorité présente.', useCase: 'Réduire l’allure, contrôler les usagers et choisir la bonne voie.', shape: 'triangle', colors: ['rouge', 'blanc'], applicability: 'common' },
  { id: 'fallback-roadworks', category: 'Danger', subcategory: 'Travaux', name: 'Travaux', description: 'Avertit d’une zone de travaux sur ou près de la chaussée.', meaning: 'La circulation peut être modifiée ou rendue plus dangereuse par les travaux.', useCase: 'Réduire la vitesse et suivre la signalisation temporaire.', shape: 'triangle', colors: ['rouge', 'blanc'], applicability: 'common' },
  { id: 'fallback-traffic-lights', category: 'Réglementation', subcategory: 'Intersection', name: 'Feux de circulation', description: 'Annonce ou rappelle la présence de feux de signalisation.', meaning: 'La circulation est réglée par les signaux lumineux selon leur état.', useCase: 'Anticiper, observer le feu et ne pas franchir un signal interdisant le passage.', shape: 'triangle', colors: ['rouge', 'blanc'], applicability: 'common' },
  { id: 'fallback-one-way', category: 'Information', subcategory: 'Direction', name: 'Sens unique', description: 'Indique une circulation autorisée dans une seule direction.', meaning: 'La circulation suit le sens indiqué par la signalisation.', useCase: 'Vérifier la direction avant de s’engager et ne jamais circuler à contresens.', shape: 'rectangle', colors: ['bleu', 'blanc'], applicability: 'common' },
  { id: 'fallback-hospital', category: 'Information', subcategory: 'Services', name: 'Hôpital', description: 'Indique ou guide vers un établissement hospitalier.', meaning: 'Fournit une information de service aux usagers.', useCase: 'Utiliser l’information pour s’orienter sans distraire la conduite.', shape: 'rectangle', colors: ['bleu', 'blanc'], applicability: 'common' },
];

async function getSigns(): Promise<Sign[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  if (!baseUrl) return FALLBACK_SIGNS;
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/learning/signs?countryCode=ZZ`, { next: { revalidate: 3600 } });
    if (!response.ok) return FALLBACK_SIGNS;
    const data = await response.json();
    return Array.isArray(data.signs) && data.signs.length > 0 ? data.signs : FALLBACK_SIGNS;
  } catch {
    return FALLBACK_SIGNS;
  }
}

export default async function SignalisationPage() {
  const signs = await getSigns();
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">ADSO Road Signs Atlas</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Voir. Comprendre. Décider.</h1>
          <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">Un atlas visuel enrichi pour apprendre la signalisation, puis s’entraîner dans des situations proches de la conduite réelle.</p>
        </header>
        <ImmersiveRoadSigns signs={signs} />
      </div>
    </main>
  );
}
