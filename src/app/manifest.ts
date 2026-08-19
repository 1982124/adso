import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ADSO — African Driving Safety & Orientation',
    short_name: 'ADSO',
    description: "Plateforme d'éducation routière, de sécurité, de prévention et d'orientation pour une mobilité responsable.",
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
