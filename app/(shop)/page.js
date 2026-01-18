import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";

// --- BIBLIOTHÈQUE D'IMAGES PAR DÉFAUT (INTELLIGENTE) ---
const CATEGORY_DEFAULTS = {
  dresses: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000",    // Robes
  shoes: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000",      // Chaussures/Talons
  bags: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000",       // Sacs
  accessories: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000", // Bijoux/Accessoires
  generic: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000"     // Mode Générale
};

// Fonction pour choisir la bonne image selon le nom de la catégorie
function getSmartCategoryImage(cat) {
  // 1. Si une image Cloud existe (AWS S3), on l'utilise
  if (cat.image && cat.image.startsWith('http')) {
    return cat.image;
  }

  // 2. Sinon (Image locale cassée ou vide), on cherche par mot-clé
  const name = cat.name.toLowerCase();
  
  if (name.includes('robe') || name.includes('dress') || name.includes('tenue')) return CATEGORY_DEFAULTS.dresses;
  if (name.includes('chaussure') || name.includes('talon') || name.includes('shoe')) return CATEGORY_DEFAULTS.shoes;
  if (name.includes('sac') || name.includes('bag') || name.includes('pochette')) return CATEGORY_DEFAULTS.bags;
  if (name.includes('accessoire') || name.includes('bijou') || name.includes('montre')) return CATEGORY_DEFAULTS.accessories;

  // 3. Fallback final
  return CATEGORY_DEFAULTS.generic;
}

// Fallback pour les produits simples
const PRODUCT_FALLBACK = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000"; 

async function getData() {
  await connectToDB();
  const categories = await Category.find();
  const products = await Product.find({}, null, { sort: { '_id': -1 }, limit: 8 });
  return { categories, products };
}

export default async function HomePage() {
  const { categories, products } = await getData();

  // URL du média Hero
  const heroMediaUrl = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070";
  const isHeroVideo = heroMediaUrl.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="bg-white min-h-screen font-montserrat overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          
          {isHeroVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-105"
            >
              <source src={heroMediaUrl} type="video/mp4" />
            </video>
          ) : (
            <Image 
              src={heroMediaUrl} 
              alt="Haute Couture Background" 
              fill 
              className="object-cover scale-105 animate-slow-zoom"
              priority
            />
          )}
        </div>

        <div className="relative z-20 text-center px-6">
          <div className="flex justify-center items-center gap-2 mb-6 animate-fade-in-down">
            <div className="h-[1px] w-8 bg-yellow-600"></div>
            <span className="text-yellow-600 text-[10px] uppercase tracking-[0.6em] font-black">Maison Esther Bella</span>
            <div className="h-[1px] w-8 bg-yellow-600"></div>
          </div>
          
          <h1 className="text-white text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.85] mb-12 uppercase italic font-serif">
            L&apos;Art du <br/> <span className="text-yellow-600 font-light not-italic">Prestige</span>
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-16">
            <Link href="/shop" className="group relative overflow-hidden bg-white text-black font-black px-16 py-6 rounded-full uppercase text-[10px] tracking-[0.3em] transition-all hover:pr-20">
              <span className="relative z-10">Explorer la collection</span>
              <ArrowRight className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={18} />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50">
          <ChevronDown size={30} />
        </div>
      </section>

      {/* --- SECTION PHILOSOPHIE --- */}
      <section className="py-32 px-6 bg-black text-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="text-yellow-600 mx-auto mb-8 opacity-50" size={32} />
          <h2 className="font-serif italic text-3xl md:text-5xl leading-tight mb-10">
            &quot;Le vêtement est le reflet d&apos;une âme qui s&apos;exprime sans un mot. À Abidjan, nous créons l&apos;exception pour les Queens et les Kings qui n&apos;acceptent que la perfection.&quot;
          </h2>
          <div className="h-12 w-[1px] bg-yellow-600 mx-auto"></div>
        </div>
      </section>

      {/* --- SECTION CATÉGORIES (INTELLIGENTE) --- */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-20">
            <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter">Univers</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.5em] font-bold">Sélection par catégorie</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => {
              // UTILISATION DE LA LOGIQUE INTELLIGENTE ICI
              const catImage = getSmartCategoryImage(cat);
              const isVideoCat = catImage.match(/\.(mp4|webm|ogg)$/i);

              return (
                <Link key={cat._id} href={`/category/${cat._id}`} className="group relative h-[700px] overflow-hidden rounded-2xl shadow-2xl bg-zinc-200">
                  {isVideoCat ? (
                    <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110">
                      <source src={catImage} type="video/mp4" />
                    </video>
                  ) : (
                    <Image 
                      src={catImage}
                      alt={cat.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-12 left-10">
                    <h3 className="text-white text-4xl font-serif italic mb-4">{cat.name}</h3>
                    <div className="flex items-center gap-4 text-yellow-600 text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden">
                      <span className="translate-y-full group-hover:translate-y-0 transition-transform duration-500">Découvrir l&apos;univers</span>
                      <ArrowRight size={14} className="-translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- SECTION PRODUITS --- */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none mb-6">
              Les <span className="text-yellow-600 italic font-serif lowercase font-light">Iconiques</span>
            </h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-24">
            {products.map((product) => {
              const isSoldOut = product.stock <= 0;
              
              // Fallback produit simple (Si lien local ou inexistant)
              let productMedia = product.images?.[0];
              if (!productMedia || (!productMedia.startsWith('http') && !productMedia.startsWith('/'))) {
                  productMedia = PRODUCT_FALLBACK;
              }
              // Pour Vercel: si c'est un lien local /uploads, on force le fallback car le fichier n'existe pas là-bas
              if (productMedia && productMedia.startsWith('/uploads')) {
                 productMedia = PRODUCT_FALLBACK;
              }

              const isVideoProd = productMedia?.match(/\.(mp4|webm|ogg)$/i);

              return (
                <Link 
                  href={'/product/' + product._id} 
                  key={product._id} 
                  className={`group relative ${isSoldOut ? 'cursor-default' : ''}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-8 rounded-sm bg-gray-100 shadow-sm">
                    {productMedia && (
                      isVideoProd ? (
                        <video autoPlay muted loop playsInline className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${isSoldOut ? 'grayscale opacity-50' : 'group-hover:scale-105'}`}>
                          <source src={productMedia} type="video/mp4" />
                        </video>
                      ) : (
                        <Image 
                          src={productMedia} 
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className={`object-cover transition-transform duration-1000 
                            ${isSoldOut ? 'grayscale opacity-50' : 'group-hover:scale-105'}`}
                        />
                      )
                    )}
                    
                    {isSoldOut ? (
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] border border-white/20">
                          Sold Out
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    )}
                    
                    {!isSoldOut && (
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur px-4 py-2 text-[10px] font-black tracking-widest shadow-xl">
                          {product.price.toLocaleString()} FCFA
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className={`h-[1px] w-4 ${isSoldOut ? 'bg-gray-300' : 'bg-yellow-600'}`}></div>
                        <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${isSoldOut ? 'text-gray-400' : 'text-yellow-600'}`}>
                         {isSoldOut ? 'Épuisé' : 'Prestige'}
                        </p>
                    </div>
                    <h3 className={`text-sm font-bold tracking-widest uppercase transition-colors 
                      ${isSoldOut ? 'text-gray-300' : 'text-black group-hover:text-yellow-600'}`}>
                      {product.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="mt-40 text-center">
            <Link href="/shop" className="group inline-flex flex-col items-center">
              <span className="text-black text-[12px] font-black uppercase tracking-[0.8em] mb-4 group-hover:text-yellow-600 transition-colors">Voir toute la collection</span>
              <div className="w-40 h-[1px] bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-yellow-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* --- BANNIÈRE MARQUE --- */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="flex overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee gap-20">
            {[1,2,3,4,5].map((i) => (
              <span key={i} className="text-6xl md:text-8xl font-black text-transparent stroke-black stroke-2 opacity-5 uppercase italic font-serif">
                Esther Bella Fashion
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}