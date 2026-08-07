import React, { useEffect } from 'react';

export const SEOStructuredData: React.FC = () => {
  useEffect(() => {
    // 1. WebSite & SoftwareApplication Schema
    const softwareSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "AI Fashion Market",
      "alternateName": "AI Fashion Market — Powered by LOOK VISION AI Fashion Operating System",
      "operatingSystem": "Web Browser, iOS, Android",
      "applicationCategory": "DesignApplication, FashionApplication, MultimediaApplication",
      "description": "AI Fashion Market (www.aifashionmarket.com) — Powered by LOOK VISION AI Fashion Operating System and ARIA Autonomous Fashion Intelligence.",
      "url": "https://www.aifashionmarket.com",
      "author": {
        "@type": "Organization",
        "name": "AI Fashion Market Technologies",
        "url": "https://www.aifashionmarket.com",
        "logo": `${window.location.origin}/logo.png`
      },
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "featureList": [
        "AI Virtual Try-On",
        "3D Garment CAD Solver",
        "Smart Wardrobe Cataloging",
        "Marketplace & Outfit Planner",
        "Community Lookbook Dossiers"
      ]
    };

    // 2. Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "AI Fashion Market",
      "url": "https://www.aifashionmarket.com",
      "logo": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=300",
      "sameAs": [
        "https://twitter.com/aifashionmarket",
        "https://instagram.com/aifashionmarket",
        "https://github.com/aifashionmarket"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-LOOK-VISION",
        "contactType": "customer service",
        "email": "support@aifashionmarket.com",
        "availableLanguage": ["English", "Urdu", "French", "Japanese"]
      }
    };

    // 3. Fashion Product Catalog Schema
    const productCatalogSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Custom Modular AI Fashion Garment",
      "image": [
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800"
      ],
      "description": "High-fidelity AI generated sartorial garment engineered via LookVision Virtual Studio.",
      "sku": "LV-GARMENT-2026",
      "brand": {
        "@type": "Brand",
        "name": "LookVision Studio"
      },
      "category": "Apparel & Accessories > Clothing",
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "USD",
        "price": "49.00",
        "priceValidUntil": "2027-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock"
      }
    };

    // 4. Breadcrumb Navigation Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home Workspace",
          "item": `${window.location.origin}/#home`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "AI Studio & Creations",
          "item": `${window.location.origin}/#studio`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Digital Wardrobe",
          "item": `${window.location.origin}/#wardrobe`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Fashion Marketplace",
          "item": `${window.location.origin}/#marketplace`
        }
      ]
    };

    // Inject script tags into document head cleanly
    const injectSchema = (id: string, data: object) => {
      let scriptElem = document.getElementById(id) as HTMLScriptElement;
      if (!scriptElem) {
        scriptElem = document.createElement('script');
        scriptElem.id = id;
        scriptElem.type = 'application/ld+json';
        document.head.appendChild(scriptElem);
      }
      scriptElem.textContent = JSON.stringify(data, null, 2);
    };

    injectSchema('schema-software', softwareSchema);
    injectSchema('schema-organization', organizationSchema);
    injectSchema('schema-product', productCatalogSchema);
    injectSchema('schema-breadcrumb', breadcrumbSchema);

    return () => {
      ['schema-software', 'schema-organization', 'schema-product', 'schema-breadcrumb'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, []);

  return null;
};
