import React from "react";
import Head from "next/head";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
  canonicalUrl?: string;
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl,
  noIndex = false,
}) => {
  const siteTitle = title ? `${title} | PollingSocial` : "PollingSocial";
  const siteDescription =
    description || "Engage with polls, share opinions, and discover trends.";
  const defaultImage = "/images/default-og.png"; // Default OG image

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />

      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:site_name" content="PollingSocial" />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Head>
  );
};
