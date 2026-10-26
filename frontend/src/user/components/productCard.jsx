
import { ShoppingCart, Star, Heart } from "lucide-react";

export default function ProductCard({ product, onAdd }) {
  const price = new Intl.NumberFormat("fr-MA").format(product.price);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:shadow-lg">
      <div className="relative bg-slate-50 p-3">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-36 w-full rounded-xl object-cover sm:h-48"
        />

        <button
          aria-label="Ajouter aux favoris"
          className="absolute right-5 top-5 rounded-full bg-white p-2 text-slate-500 shadow-sm hover:text-red-500"
        >
          <Heart size={17} />
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <p className="text-[10px] font-semibold uppercase text-[#0077B6]">
          {product.category}
        </p>

        <h3 className="mt-2 min-h-10 text-sm font-bold leading-5 text-[#03045E]">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1 text-xs">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="font-bold">{product.rating}</span>
          <span className="text-slate-400">
            ({product.reviews} avis)
          </span>
        </div>

        <p className="mt-3 text-lg font-extrabold text-[#03045E]">
          {price} DH
        </p>

        <p className="mt-2 text-xs font-semibold text-emerald-600">
          ● {product.stock}
        </p>

        <button
          onClick={() => onAdd(product)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0077B6] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#023E8A] sm:text-sm"
        >
          <ShoppingCart size={16} />
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}
