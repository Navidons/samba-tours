import { createClient } from "@/lib/supabase"
import { SEO_CONFIG } from "@/lib/seo"

export async function GET() {
  const supabase = createClient()
  
  // Static pages
  const staticPages = [
    {
      url: '',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/about',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/tours',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/blog',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      url: '/contact',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/services',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/gallery',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.6'
    },
    {
      url: '/bookings',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.6'
    }
  ]

  // Dynamic pages - Tours
  let tourPages: any[] = []
  try {
    const { data: tours } = await supabase
      .from('tours')
      .select('id, updated_at')
      .eq('status', 'published')
    
    if (tours) {
      tourPages = tours.map(tour => ({
        url: `/tours/${tour.id}`,
        lastmod: tour.updated_at || new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      }))
    }
  } catch (error) {
    console.error('Error fetching tours for sitemap:', error)
  }

  // Dynamic pages - Blog posts
  let blogPages: any[] = []
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)
    
    if (posts) {
      blogPages = posts.map(post => ({
        url: `/blog/${post.slug}`,
        lastmod: post.updated_at || new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.7'
      }))
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  // Combine all pages
  const allPages = [...staticPages, ...tourPages, ...blogPages]

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SEO_CONFIG.siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
} 