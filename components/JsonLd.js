// Données structurées lues par Google. « < » est échappé pour ne jamais pouvoir fermer la balise.
export default function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
