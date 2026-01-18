export default function FooterPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-24 text-yellow-600">
      <h1 className="text-3xl font-bold uppercase tracking-widest mb-20 text-center">
        Informations
      </h1>

      {/* SERVICE CLIENT */}
      <section id="service-client" className="mb-24 scroll-mt-32">
        <h2 className="font-bold uppercase tracking-[0.3em] mb-6 border-b border-yellow-600/30 pb-2">
          Service Client
        </h2>
        <p className="leading-relaxed text-sm">
          Pour toute question concernant vos commandes, livraisons ou retours,
          notre service client est à votre disposition.
        </p>
      </section>

      {/* LIVRAISON & RETOURS */}
      <section id="livraison-retours" className="mb-24 scroll-mt-32">
        <h2 className="font-bold uppercase tracking-[0.3em] mb-6 border-b border-yellow-600/30 pb-2">
          Livraison & Retours
        </h2>
        <p className="leading-relaxed text-sm">
          Les commandes sont préparées avec soin et livrées dans les meilleurs délais.
          Les retours sont acceptés selon nos conditions générales.
        </p>
      </section>

      {/* GUIDE DES TAILLES */}
      <section id="guide-tailles" className="mb-24 scroll-mt-32">
        <h2 className="font-bold uppercase tracking-[0.3em] mb-6 border-b border-yellow-600/30 pb-2">
          Guide des Tailles
        </h2>
        <p className="leading-relaxed text-sm">
          Consultez notre guide des tailles pour choisir la coupe parfaite.
        </p>
      </section>

      {/* NOTRE HISTOIRE */}
      <section id="notre-histoire" className="mb-24 scroll-mt-32">
        <h2 className="font-bold uppercase tracking-[0.3em] mb-6 border-b border-yellow-600/30 pb-2">
          Notre Histoire
        </h2>
        <p className="leading-relaxed text-sm">
          Esther Bella Fashion est née d’une passion pour l’élégance et
          l’authenticité.
        </p>
      </section>

      {/* ETHIQUE */}
      <section id="ethique-qualite" className="mb-24 scroll-mt-32">
        <h2 className="font-bold uppercase tracking-[0.3em] mb-6 border-b border-yellow-600/30 pb-2">
          Éthique & Qualité
        </h2>
        <p className="leading-relaxed text-sm">
          Nous privilégions des matériaux de qualité et une production responsable.
        </p>
      </section>

      {/* POINTS DE VENTE */}
      <section id="points-vente" className="scroll-mt-32">
        <h2 className="font-bold uppercase tracking-[0.3em] mb-6 border-b border-yellow-600/30 pb-2">
          Points de Vente
        </h2>
        <p className="leading-relaxed text-sm">
          Retrouvez nos collections dans nos boutiques partenaires.
        </p>
      </section>
    </main>
  );
}
