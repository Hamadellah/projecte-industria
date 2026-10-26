import { Link } from "react-router-dom";
import { ArrowRight, MoveUpRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Forage & puits",
    slug: "forage-puits",
    image: "/images/categories/forage.jpg",
    description: "Équipements et accessoires pour le forage et les puits.",
  },
  {
    id: 2,
    name: "Pompes",
    slug: "pompes",
    image: "/images/categories/pompes.jpg",
    description: "Des solutions de pompage pour vos installations.",
  },
  {
    id: 3,
    name: "Tuyaux & raccords",
    slug: "tuyaux-raccords",
    image: "/images/categories/tuyaux.jpg",
    description: "Tuyaux et raccords pour vos installations hydrauliques.",
  },
  {
    id: 4,
    name: "Outillage",
    slug: "outillage",
    image: "/images/categories/outillage.jpg",
    description: "Les outils essentiels pour vos travaux professionnels.",
  },
  {
    id: 5,
    name: "Protection",
    slug: "protection",
    image: "/images/categories/protection.jpg",
    description: "Équipements de protection pour travailler en sécurité.",
  },
];

function Categories() {
  return (
    <section className="w-full bg-[#F8FAFC] px-4 py-14 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-0.5 w-8 bg-[#00B4D8]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0077B6]">
                Notre catalogue
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-[#03045E] sm:text-3xl lg:text-4xl">
              Explorez nos catégories
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Découvrez notre sélection d'équipements pour vos projets
              industriels, de forage et de pompage.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#0077B6] hover:text-[#03045E]"
          >
            Toutes les catégories <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category, index) => (
            <Link
              to={`/categories/${category.slug}`}
              key={category.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#90E0EF] hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#CAF0F8] to-[#90E0EF]">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#03045E]/70 to-transparent" />

                <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-[#03045E]/70 px-3 py-1 text-xs font-semibold text-white">
                  0{index + 1}
                </span>

                <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#03045E] transition group-hover:bg-[#00B4D8]">
                  <MoveUpRight size={18} />
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-[#03045E] group-hover:text-[#0077B6]">
                  {category.name}
                </h3>

                <p className="mt-2 min-h-[60px] text-sm leading-5 text-slate-500">
                  {category.description}
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-[#0077B6]">
                  Découvrir
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;