
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  SlidersHorizontal,
  ArrowLeft,
  Droplets,
  Check,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Pompe immergée 1.5 CV",
    category: "Pompe immergée",
    price: 1450,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    description: "Pompe pour puits et forage, adaptée à l'alimentation en eau.",
  },
  {
    id: 2,
    name: "Pompe centrifuge 2 CV",
    category: "Pompe centrifuge",
    price: 1850,
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80",
    description: "Solution performante pour le transfert d'eau.",
  },
  {
    id: 3,
    name: "Pompe de surface 1 CV",
    category: "Pompe de surface",
    price: 980,
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80",
    description: "Pompe compacte pour les installations domestiques.",
  },
  {
    id: 4,
    name: "Pompe de forage 3 CV",
    category: "Pompe immergée",
    price: 2650,
    image:
      "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=600&q=80",
    description: "Conçue pour les applications de forage et d'irrigation.",
  },
  {
    id: 5,
    name: "Pompe multicellulaire 2 CV",
    category: "Pompe centrifuge",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80",
    description: "Pompe polyvalente pour les besoins en pression.",
  },
  {
    id: 6,
    name: "Pompe d'irrigation 1.5 CV",
    category: "Pompe de surface",
    price: 1250,
    image:
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=600&q=80",
    description: "Adaptée aux installations d'arrosage et d'irrigation.",
  },
];

const categories = [
  "Toutes",
  "Pompe immergée",
  "Pompe centrifuge",
  "Pompe de surface",
];

export default function Pumps({
  cartCount = 0,
  onAdd,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [addedId, setAddedId] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "Toutes" || product.category === category;

      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [search, category, maxPrice]);

  function handleAdd(product) {
    if (onAdd) {
      onAdd(product);
      setAddedId(product.id);
    } else {
      alert("La fonction panier n'est pas encore connectée.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-[#03045E]"
          >
            INDUSTRIA
          </Link>

          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="hidden text-sm font-medium text-gray-600 hover:text-[#0077B6] sm:block"
            >
              Accueil
            </Link>

            <Link
              to="/panier"
              aria-label="Ouvrir le panier"
              className="relative rounded-lg p-2 text-[#03045E] hover:bg-blue-50"
            >
              <ShoppingCart size={23} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0077B6] px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#0077B6]">
            Accueil
          </Link>
          <span>/</span>
          <span className="font-medium text-[#03045E]">Pompes</span>
        </nav>

        {/* Page title */}
        <section className="mb-8 rounded-2xl bg-gradient-to-r from-[#03045E] to-[#0077B6] px-6 py-8 text-white sm:px-10 sm:py-12">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-200">
              Équipements industriels
            </p>

            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Pompes et solutions de pompage
            </h1>

            <p className="mt-4 leading-7 text-blue-100">
              Découvrez notre sélection de pompes pour le forage,
              l'irrigation et les installations d'alimentation en eau.
            </p>
          </div>
        </section>

        {/* Search */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une pompe..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-[#0077B6] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
            <SlidersHorizontal size={19} className="text-[#0077B6]" />
            <span className="text-sm font-medium text-gray-700">
              {filteredProducts.length} produit(s)
            </span>
          </div>
        </div>

        {/* Products and filters */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
          <aside className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-1">
            <h2 className="mb-5 text-lg font-bold text-[#03045E]">
              Filtrer les produits
            </h2>

            <div className="mb-7">
              <h3 className="mb-3 text-sm font-semibold text-gray-800">
                Catégorie
              </h3>

              <div className="space-y-3">
                {categories.map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-3 text-sm text-gray-600"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={category === item}
                      onChange={() => setCategory(item)}
                      className="h-4 w-4 accent-[#0077B6]"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  Prix maximum
                </h3>
                <span className="text-sm font-bold text-[#0077B6]">
                  {maxPrice.toLocaleString("fr-FR")} DH
                </span>
              </div>

              <input
                type="range"
                min="500"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="w-full accent-[#0077B6]"
                aria-label="Prix maximum"
              />

              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>500 DH</span>
                <span>3 000 DH</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("Toutes");
                setMaxPrice(3000);
              }}
              className="mt-6 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-[#0077B6] hover:text-[#0077B6]"
            >
              Réinitialiser les filtres
            </button>
          </aside>

          {/* Product grid */}
          <section className="lg:col-span-3">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-[#03045E]">
                Nos pompes
              </h2>

              <span className="text-sm text-gray-500">
                {filteredProducts.length} résultat(s)
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
                <Droplets
                  size={38}
                  className="mx-auto mb-4 text-gray-300"
                />

                <h3 className="text-lg font-bold text-gray-800">
                  Aucun produit trouvé
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Essayez une autre recherche ou modifiez vos filtres.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("Toutes");
                    setMaxPrice(3000);
                  }}
                  className="mt-5 font-semibold text-[#0077B6]"
                >
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gray-50 p-5">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                      />

                      <span className="absolute left-3 top-3 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#023E8A]">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="min-h-12 font-bold leading-6 text-gray-800">
                        {product.name}
                      </h3>

                      <p className="mt-2 min-h-10 text-sm leading-5 text-gray-500">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span className="text-lg font-extrabold text-[#03045E]">
                          {product.price.toLocaleString("fr-FR")} DH
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdd(product)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0077B6] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#023E8A]"
                      >
                        {addedId === product.id ? (
                          <>
                            <Check size={18} />
                            Ajouté au panier
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={18} />
                            Ajouter au panier
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#0077B6] hover:text-[#023E8A]"
        >
          <ArrowLeft size={17} />
          Retour à l'accueil
        </Link>
      </main>

      <footer className="mt-10 bg-[#03045E] py-6 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 text-sm sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} INDUSTRIA. Tous droits réservés.</p>
          <p>Équipements industriels au Maroc</p>
        </div>
      </footer>
    </div>
  );
}
