import { SEO_CONFIG } from "@/lib/seo"

export function GET() {
  const robotsContent = `User-agent: *
Allow: /

# Important pages
Allow: /tours
Allow: /blog
Allow: /about
Allow: /contact
Allow: /services
Allow: /gallery

# Block admin routes
Disallow: /admin/
Disallow: /api/

# Block search and private routes
Disallow: /search?*
Disallow: /cart/confirmation

# Sitemap location
Sitemap: ${SEO_CONFIG.siteUrl}/sitemap.xml

# Crawl delay for polite crawling
Crawl-delay: 1
`

  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
} 