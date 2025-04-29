import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://mcp-server-directory.com/sitemap.xml',
    host: 'https://mcp-server-directory.com',
  };
} 