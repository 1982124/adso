import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ADSO — Auto Drive School Online',
    short_name: 'ADSO',
    description: "Plateforme internationale d'apprentissage de la mobilité, de la conduite et de la sécurité routière.",
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
