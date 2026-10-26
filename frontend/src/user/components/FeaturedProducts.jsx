import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingCart,
  Eye,
  Package,
  Check,
  Clock,
} from "lucide-react";

const products = [
  {
    id: 1,
    category_id: 2,
    name: "Pompe immergée professionnelle",
    reference: "PMP-001",
    slug: "pompe-immergee-professionnelle",
    description: "Pompe conçue pour les applications de pompage d'eau.",
    price: 2450.0,
    stock_quantity: 12,
    is_active: true,
    image: "/images/products/pompe-immergee.jpg",
    badge: "Populaire",
  },
  {
    id: 2,
    category_id: 1,
    name: "Foret de forage industriel",
    reference: "FOR-002",
    slug: "foret-forage-industriel",
    description: "Accessoire de forage pour les travaux professionnels.",
    price: 890.0,
    stock_quantity: 8,
    is_active: true,
    image: "/images/products/foret-forage.jpg",
    badge: null,
  },
  {
    id: 3,
    category_id: 3,
    name: "Tuyau haute pression",
    reference: "TUY-003",
    slug: "tuyau-haute-pression",
    description: "Tuyau destiné aux installations hydrauliques.",
    price: 320.0,
    stock_quantity: 25,
    is_active: true,
    image: "/images/products/tuyau-pression.jpg",
    badge: null,
  },
  {
    id: 4,
    category_id: 4,
    name: "Clé professionnelle renforcée",
    reference: "OUT-004",
    slug: "cle-professionnelle-renforcee",
    description: "Outil robuste pour les interventions techniques.",
    price: 175.0,
    stock_quantity: 0,
    is_active: true,
    image: "/images/products/cle-professionnelle.jpg",
    badge: "Sur commande",
  },
];

function FeaturedProducts() {
  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      maximumFractionDigits: 2,
    }).format(price);

  const visibleProducts = products.filter(
    (product) => product.is_active
  );

  return (
    <section className="w-full bg-white px-4 py-14 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        {/* Heading */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-0.5 w-8 bg-[#00B4D8]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0077B6]">
                Notre sélection
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-[#03045E] sm:text-3xl lg:text-4xl">
              Nos produits
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Découvrez une sélection d'équipements pour vos besoins
              industriels et hydrauliques.
            </p>
          </div>

          <Link
            to="/produits"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#0077B6] transition hover:text-[#03045E]"
          >
            Voir tous les produits
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => {
            const inStock = product.stock_quantity > 0;

            return (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#90E0EF] hover:shadow-xl hover:shadow-[#03045E]/10"
              >
                {/* Product image */}
                <div className="relative flex h-60 items-center justify-center overflow-hidden bg-[#F8FAFC] p-5">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  {product.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-[#03045E] px-3 py-1.5 text-xs font-bold text-white">
                      {product.badge}
                    </span>
                  )}

                  <Link
                    to={`/produits/${product.slug}`}
                    aria-label={`Voir ${product.name}`}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#03045E] opacity-0 shadow-sm transition hover:bg-[#00B4D8] group-hover:opacity-100"
                  >
                    <Eye size={17} />
                  </Link>
                </div>

                {/* Product information */}
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Réf. {product.reference}
                  </p>

                  <h3 className="mt-2 min-h-[48px] text-base font-bold leading-6 text-[#03045E] transition group-hover:text-[#0077B6]">
                    {product.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
                    {product.description}
                  </p>

                  {/* Stock */}
                  <div className="mt-4 flex items-center gap-2">
                    {inStock ? (
                      <>
                        <Check size={15} className="text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-700">
                          En stock ({product.stock_quantity})
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock size={15} className="text-amber-600" />
                        <span className="text-xs font-medium text-amber-700">
                          Disponible sur commande
                        </span>
                      </>
                    )}
                  </div>

                  {/* Price and action */}
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-400">Prix indicatif</p>
                      <p className="mt-1 text-lg font-extrabold text-[#03045E]">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!inStock}
                      onClick={() => {
                        console.log("Produit à ajouter au panier :", product);
                      }}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0077B6] text-white transition hover:bg-[#03045E] disabled:cursor-not-allowed disabled:bg-slate-300"
                      aria-label={`Ajouter ${product.name} au panier`}
                      title={
                        inStock ? "Ajouter au panier" : "Produit indisponible"
                      }
                    >
                      <ShoppingCart size={19} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom link */}
        <div className="mt-9 text-center">
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 rounded-lg border border-[#0077B6] px-6 py-3 text-sm font-bold text-[#0077B6] transition hover:bg-[#0077B6] hover:text-white"
          >
            Explorer le catalogue
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;