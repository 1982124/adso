import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXTAUTH_URL || 'https://adso-ai-driving.vercel.app').replace(/\/$/, '');
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/student`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ];
}
