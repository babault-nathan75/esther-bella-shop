// app/sitemap.js
export default async function sitemap() {
  const baseUrl = "https://votre-domaine.com";
  // Vous pouvez aussi boucler sur vos produits ici
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/shop`, lastModified: new Date() },
    { url: `${baseUrl}/nouveautes`, lastModified: new Date() },
  ];
}