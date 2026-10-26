import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, PackageCheck } from "lucide-react";

export default function Cart({
  cart = [],
  cartCount = 0,
  cartTotal = 0,
  onUpdateQuantity,
  onRemove,
}) {
  const delivery = cart.length > 0 ? 60 : 0;
  const total = cartTotal + delivery;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold text-[#03045E]">
            INDUSTRIA
          </Link>

          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-[#0077B6]"
          >
            Continuer les achats
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0077B6] mb-4"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>

          <h1 className="text-3xl font-bold text-[#03045E]">
            Mon panier
          </h1>

          <p className="text-gray-500 mt-2">
            {cartCount} article{cartCount !== 1 ? "s" : ""} dans votre panier
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty cart */
          <div className="bg-white rounded-xl border border-gray-200 p-10 md:p-16 text-center">
            <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <ShoppingCart size={30} className="text-[#0077B6]" />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Votre panier est vide
            </h2>

            <p className="text-gray-500 mt-2 mb-6">
              Découvrez nos équipements industriels et ajoutez vos produits.
            </p>

            <Link
              to="/pompes"
              className="inline-flex items-center justify-center rounded-lg bg-[#0077B6] px-6 py-3 text-white font-semibold hover:bg-[#023E8A] transition"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products */}
            <section className="lg:col-span-2 space-y-4">
              {cart.map((product) => (
                <article
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-5"
                >
                  <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <PackageCheck
                        size={36}
                        className="text-gray-300"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h2 className="font-bold text-gray-800">
                          {product.name}
                        </h2>

                        {product.category && (
                          <p className="text-sm text-gray-500 mt-1">
                            {product.category}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemove?.(product.id)}
                        aria-label={`Supprimer ${product.name}`}
                        className="text-gray-400 hover:text-red-500 h-fit"
                      >
                        <Trash2 size={19} />
                      </button>
                    </div>

                    <p className="text-lg font-bold text-[#0077B6] mt-3">
                      {Number(product.price).toLocaleString("fr-FR")} DH
                    </p>

                    <div className="flex items-center justify-between gap-4 mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity?.(
                              product.id,
                              product.quantity - 1
                            )
                          }
                          disabled={product.quantity <= 1}
                          aria-label="Diminuer la quantité"
                          className="p-2 hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="min-w-10 text-center text-sm font-semibold">
                          {product.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity?.(
                              product.id,
                              product.quantity + 1
                            )
                          }
                          aria-label="Augmenter la quantité"
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <p className="font-bold text-gray-800">
                        {(
                          Number(product.price) * product.quantity
                        ).toLocaleString("fr-FR")}{" "}
                        DH
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              <Link
                to="/pompes"
                className="inline-flex items-center gap-2 text-[#0077B6] font-semibold hover:text-[#023E8A] pt-2"
              >
                <ArrowLeft size={17} />
                Continuer les achats
              </Link>
            </section>

            {/* Order summary */}
            <aside className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
                <h2 className="text-xl font-bold text-[#03045E] mb-6">
                  Résumé de la commande
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between gap-3 text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-medium text-gray-800">
                      {cartTotal.toLocaleString("fr-FR")} DH
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-gray-600">
                    <span>Livraison</span>
                    <span className="font-medium text-gray-800">
                      {delivery} DH
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between gap-3">
                    <span className="font-bold text-gray-800">
                      Total TTC
                    </span>
                    <span className="text-xl font-extrabold text-[#03045E]">
                      {total.toLocaleString("fr-FR")} DH
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    alert("La fonctionnalité de commande sera bientôt disponible.")
                  }
                  className="w-full mt-6 rounded-lg bg-[#0077B6] hover:bg-[#023E8A] text-white font-bold py-3 px-4 transition"
                >
                  Passer la commande
                </button>

                <div className="mt-5 flex items-start gap-3 text-sm text-gray-500">
                  <PackageCheck
                    size={20}
                    className="text-[#0077B6] shrink-0"
                  />
                  <p>
                    Commande sécurisée et accompagnement par notre équipe.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[#03045E] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between gap-3 text-sm">
          <p>© {new Date().getFullYear()} INDUSTRIA. Tous droits réservés.</p>
          <p>Votre partenaire en équipements industriels.</p>
        </div>
      </footer>
    </div>
  );
}
