import { ArrowRight } from "lucide-react";
import ProductCard from "./productCard";
import { products } from "../data/products";

export default function BestSellers({ onAdd }) {
  return (
    <section id="best-sellers" className="bg-sky-50/70 py-10 sm:py-14">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0077B6]">
              Sélection INDUSTRIA
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#03045E] sm:text-3xl">
              Nos meilleures ventes
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Des équipements fiables pour vos projets.
            </p>
          </div>

          <a
            href="#categories"
            className="hidden items-center gap-1 text-sm font-bold text-[#0077B6] sm:flex"
          >
            Tout voir <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={onAdd}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
