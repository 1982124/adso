import { NextResponse } from 'next/server';

const PROGRAM = {
  name: 'ADSO Education',
  tagline: "La sécurité routière commence sur les bancs de l'école.",
  levels: [
    { code: 'primary', name: 'Primaire', focus: 'Découvrir la route' },
    { code: 'middle', name: 'Collège', focus: 'Comprendre la circulation' },
    { code: 'high', name: 'Lycée', focus: 'Se préparer à devenir conducteur' },
    { code: 'university', name: 'Université', focus: 'Conducteur et citoyen responsable' },
  ],
  models: ['individual', 'institution'],
};

export async function GET() {
  return NextResponse.json(PROGRAM, { headers: { 'Cache-Control': 'public, max-age=300' } });
}
