
import { ArrowUpRight } from "lucide-react";
import { categories } from "../data/products";

export default function Categories() {
  return (
    <section id="categories" className="mx-auto max-w-[1240px] px-4 py-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0077B6]">
          Explorez notre catalogue
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-[#03045E] sm:text-3xl">
          Nos catégories
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Tout l’équipement essentiel, au même endroit.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((category) => (
          <a
            href="#best-sellers"
            key={category.id}
            className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="h-32 overflow-hidden sm:h-44">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
              <div>
                <h3 className="text-sm font-bold text-[#03045E] sm:text-base">
                  {category.name}
                </h3>
                <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                  {category.description}
                </p>
              </div>
              <ArrowUpRight
                size={19}
                className="shrink-0 text-[#0077B6]"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
