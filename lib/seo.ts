import type { Metadata } from "next"

// SEO Configuration
export const SEO_CONFIG = {
  siteName: "Samba Tours and Travel",
  siteUrl: "https://sambatoursandtravel.com",
  defaultTitle: "Samba Tours and Travel - Uganda Tours, Safaris, Hotel Booking & Visa Services",
  defaultDescription: "Explore Uganda with Samba Tours. Best travel agency for tours, safaris, hotel bookings, and visa assistance. Your ultimate travel partner in East Africa.",
  company: {
    name: "Samba Tours and Travel",
    description: "Leading tour and travel agency in Uganda offering safari tours, hotel booking, and visa assistance.",
    address: {
      street: "Plot X, Kampala Road",
      city: "Kampala",
      country: "Uganda",
      countryCode: "UG"
    },
    phone: "+256xxxxxxxxx",
    email: "info@sambatoursandtravel.com"
  },
  social: {
    facebook: "https://facebook.com/sambatoursandtravel",
    instagram: "https://instagram.com/sambatoursandtravel",
    twitter: "https://twitter.com/sambatoursug"
  }
}

// Page-specific SEO configurations
export const PAGE_SEO = {
  home: {
    title: "Samba Tours and Travel - Uganda Tours, Safaris, Hotel Booking & Visa Services",
    description: "Explore Uganda with Samba Tours. Best travel agency for tours, safaris, hotel bookings, and visa assistance. Book your adventure today!",
    keywords: ["Uganda Tours", "Uganda Travel Agency", "Best Safari Company Uganda", "Travel Agent Uganda", "Uganda Wildlife Tours", "Gorilla Trekking Uganda"],
    h1: "Discover Uganda with Samba Tours and Travel - Your Ultimate Travel Partner"
  },
  tours: {
    title: "Uganda Safari Packages | Gorilla Trekking | Wildlife Tours - Samba Tours",
    description: "Discover amazing Uganda safari packages, gorilla trekking adventures, and wildlife tours. Book your dream safari with Uganda's trusted travel experts.",
    keywords: ["Uganda Safari Packages", "Gorilla Trekking Uganda", "Uganda Wildlife Tours", "Affordable Uganda Safaris", "Family Tours in Uganda"],
    h1: "Uganda Safari Packages & Wildlife Tours"
  },
  hotels: {
    title: "Hotel Booking Uganda | Best Hotels Kampala | Accommodation - Samba Tours",
    description: "Book the best hotels in Uganda. From luxury resorts to budget accommodations in Kampala, Entebbe, and safari lodges across Uganda.",
    keywords: ["Hotel Booking Uganda", "Cheap Hotels Uganda", "Best Hotels Kampala", "Uganda Accommodation", "Safari Lodges Uganda"],
    h1: "Hotel Booking & Accommodation in Uganda"
  },
  visa: {
    title: "Uganda Visa Assistance | Visa Help Uganda | Travel Visa Services",
    description: "Get expert Uganda visa assistance and travel visa services. We help with visa applications, processing, and travel documentation.",
    keywords: ["Uganda Visa Assistance", "Visa Help Uganda", "Travel Visa Uganda", "Uganda Visa Processing", "East Africa Visa"],
    h1: "Uganda Visa Assistance & Travel Documentation"
  },
  about: {
    title: "About Samba Tours | Best Tour Company in Uganda | Uganda Travel Experts",
    description: "Learn about Samba Tours, Uganda's premier travel company. Discover why we're the best tour company in Uganda with years of travel expertise.",
    keywords: ["Best Tour Company in Uganda", "Uganda Travel Experts", "About Samba Tours", "Uganda Travel Agency", "East Africa Travel Specialists"],
    h1: "About Samba Tours - Uganda's Premier Travel Company"
  },
  contact: {
    title: "Contact Samba Tours | Uganda Travel Agency | Get Travel Assistance",
    description: "Contact Samba Tours for all your Uganda travel needs. Get expert travel assistance, book tours, hotels, and visa services.",
    keywords: ["Contact Samba Tours", "Uganda Travel Agency Contact", "Travel Assistance Uganda", "Book Uganda Tours"],
    h1: "Contact Samba Tours - Your Uganda Travel Experts"
  },
  blog: {
    title: "Uganda Travel Blog | Safari Tips | Travel Guides - Samba Tours",
    description: "Read our Uganda travel blog for safari tips, travel guides, and insider knowledge about Uganda tourism and East Africa adventures.",
    keywords: ["Uganda Travel Blog", "Safari Tips", "Uganda Travel Guide", "Uganda Tourism", "East Africa Travel Tips"],
    h1: "Uganda Travel Blog & Safari Guides"
  }
}

// Generate comprehensive metadata
export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  path = "",
  image = "/images/samba-tours-og.jpg",
  type = "website",
  publishedTime,
  modifiedTime,
  author
}: {
  title?: string
  description?: string
  keywords?: string[]
  path?: string
  image?: string
  type?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
}): Metadata {
  const fullTitle = title || SEO_CONFIG.defaultTitle
  const fullDescription = description || SEO_CONFIG.defaultDescription
  const url = `${SEO_CONFIG.siteUrl}${path}`
  const imageUrl = image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image}`

  return {
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    title: fullTitle,
    description: fullDescription,
    keywords: keywords.join(", "),
    authors: author ? [{ name: author }] : undefined,
    creator: SEO_CONFIG.siteName,
    publisher: SEO_CONFIG.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: SEO_CONFIG.siteName,
      locale: "en_US",
      type: type as any,
      publishedTime,
      modifiedTime,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    
    // Twitter
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [imageUrl],
      creator: "@sambatoursug",
      site: "@sambatoursug",
    },
    
    // Additional meta tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    
    // Canonical URL
    alternates: {
      canonical: url,
    },
    
    // Verification (you'll need to add your actual verification codes)
    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
      yahoo: "your-yahoo-verification-code",
    },
  }
}

// Generate structured data (Schema.org JSON-LD)
export function generateBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SEO_CONFIG.company.name,
    description: SEO_CONFIG.company.description,
    url: SEO_CONFIG.siteUrl,
    telephone: SEO_CONFIG.company.phone,
    email: SEO_CONFIG.company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SEO_CONFIG.company.address.street,
      addressLocality: SEO_CONFIG.company.address.city,
      addressCountry: SEO_CONFIG.company.address.countryCode,
    },
    sameAs: [
      SEO_CONFIG.social.facebook,
      SEO_CONFIG.social.instagram,
      SEO_CONFIG.social.twitter,
    ],
    areaServed: [
      {
        "@type": "Country",
        name: "Uganda"
      },
      {
        "@type": "Continent",
        name: "Africa"
      }
    ],
    serviceType: [
      "Safari Tours",
      "Hotel Booking",
      "Visa Assistance",
      "Airport Transfers",
      "Travel Planning"
    ]
  }
}

export function generateTourPackageSchema({
  name,
  description,
  price,
  duration,
  location,
  image,
  url,
  rating,
  reviewCount
}: {
  name: string
  description: string
  price?: number
  duration?: string
  location: string
  image?: string
  url: string
  rating?: number
  reviewCount?: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description,
    url: `${SEO_CONFIG.siteUrl}${url}`,
    image: image ? `${SEO_CONFIG.siteUrl}${image}` : undefined,
    touristType: "Leisure",
    itinerary: {
      "@type": "ItemList",
      name: `${name} Itinerary`,
      description: `Detailed itinerary for ${name}`
    },
    provider: {
      "@type": "TravelAgency",
      name: SEO_CONFIG.company.name,
      url: SEO_CONFIG.siteUrl
    },
    offers: price ? {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString()
    } : undefined,
    aggregateRating: rating && reviewCount ? {
      "@type": "AggregateRating",
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString()
    } : undefined
  }
}

export function generateBlogPostSchema({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  image,
  url
}: {
  title: string
  description: string
  author: string
  publishedTime: string
  modifiedTime?: string
  image?: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.company.name,
      logo: {
        "@type": "ImageObject",
        url: `${SEO_CONFIG.siteUrl}/images/logo.png`
      }
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SEO_CONFIG.siteUrl}${url}`
    },
    image: image ? {
      "@type": "ImageObject",
      url: `${SEO_CONFIG.siteUrl}${image}`,
      width: 1200,
      height: 630
    } : undefined
  }
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SEO_CONFIG.siteUrl}${item.url}`
    }))
  }
}

// Note: StructuredData component moved to components/seo/structured-data.tsx 