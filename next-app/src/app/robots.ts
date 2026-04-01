import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/portal/', '/api/'], // Protect admin and api routes
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
