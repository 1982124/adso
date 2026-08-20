import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXTAUTH_URL || 'https://adso-safety.vercel.app').replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
