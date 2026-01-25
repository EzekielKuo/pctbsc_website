import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pctbsc-website.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: 'join', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'bsc/theme', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: 'bsc/info', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: 'bsc/schedule', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: 'bsc/questionnaire', priority: 0.7, changeFrequency: 'daily' as const },
    { path: 'interview', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'interview/chen-nan-zhou', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: 'interview/huang-chun-sheng', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: 'interview/huang-hsu-hui', priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: path ? `${BASE_URL}/${path}` : BASE_URL,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
