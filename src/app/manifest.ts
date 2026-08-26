import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ADSO AFRICA — Mobilité plus sûre et plus responsable',
    short_name: 'ADSO AFRICA',
    description: "Plateforme africaine d'éducation routière, de formation à la mobilité, de prévention, de simulation et d'évaluation et reconnaissance des compétences acquises.",
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#059669',
    orientation: 'portrait-primary',
    lang: 'fr',
    dir: 'ltr',
    categories: ['education', 'lifestyle', 'navigation'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
