export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://esther-bella-shop.vercel.app";
export const SITE_NAME = "Esther Bella Shop";

export const storeJsonLd = (sameAs) => ({
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": `${SITE_URL}/#store`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  image: `${SITE_URL}/brand/og.jpg`,
  telephone: "+2250787335847",
  email: "kimouchiayeesthermorille@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Abidjan", addressCountry: "CI" },
  areaServed: { "@type": "City", name: "Abidjan" },
  currenciesAccepted: "XOF",
  paymentAccepted: "Espèces, Orange Money, Wave, MTN Money, Moov Money",
  sameAs,
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "fr",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/recherche?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

export const productJsonLd = (product) => {
  const url = `${SITE_URL}/product/${product._id}`;
  const images = (product.images || []).filter((src) => /^https?:.*\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(src));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.title,
        url,
        description: product.description || `${product.title}, chez ${SITE_NAME} à Abidjan.`,
        ...(images.length ? { image: images } : {}),
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
          "@type": "Offer",
          url,
          price: product.price,
          priceCurrency: "XOF",
          availability: product.available === false ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          seller: { "@id": `${SITE_URL}/#store` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Boutique", item: `${SITE_URL}/shop` },
          { "@type": "ListItem", position: 3, name: product.title, item: url },
        ],
      },
    ],
  };
};
