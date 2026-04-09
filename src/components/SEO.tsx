import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'BeautybyVicky - Professional Makeup Artist in Lagos',
  description = 'Discover the transformative power of professional makeup artistry with BeautybyVicky. Luxury makeup services for bridal, events, photoshoots, and lessons in the heart of Lagos.',
  keywords = 'makeup artist, Lagos, bridal makeup, professional makeup, beauty services, makeup lessons, events makeup, photoshoot makeup',
  ogImage = '/hero.jpeg',
  ogUrl,
  canonical,
  type = 'website'
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://beautybyvickys.com';
  const fullUrl = ogUrl || siteUrl;
  const canonicalUrl = canonical || fullUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Beauty by Vicky's" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Additional Meta Tags */}
      <meta name="author" content="Beauty by Vicky's" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="NG-LA" />
      <meta name="geo.placename" content="Lagos" />
      <meta name="ICBM" content="6.5244;3.3792" />

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      
      {/* Apple Touch Icon */}
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#9D4060" />
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    </Helmet>
  );
};

export default SEO;
