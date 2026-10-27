import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Page from '../components/Page'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, total, count, setQty, remove, clear } = useCart()

  if (items.length === 0) {
    return (
      <Page title="Panier">
        <h1 className="display scene-title text-white">Votre panier est vide.</h1>
        <p className="mt-4 text-steel-300">Ajoutez des équipements depuis le catalogue pour préparer une demande de devis.</p>
        <Link to="/catalogue" className="btn-volt mt-8">Parcourir le catalogue</Link>
      </Page>
    )
  }

  return (
    <Page title="Panier" wide>
      <h1 className="display scene-title text-white">Panier</h1>
      <p className="mt-3 text-steel-500">Panier de démonstration enregistré dans votre navigateur. Aucune commande n’est passée.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <ul className="divide-y divide-steel-700/40 border-y border-steel-700/40">
          {items.map(({ id, qty, product }) => (
            <li key={id} className="grid gap-4 py-6 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <div>
                <Link to={`/produit/${id}`} className="display text-2xl font-bold text-white hover:text-volt-400">{product.name}</Link>
                <p className="text-steel-500">Réf. {product.ref} · {formatPrice(product.price)} l’unité</p>
              </div>
              <div className="flex items-center border border-steel-700/60" role="group" aria-label={`Quantité de ${product.name}`}>
                <button type="button" className="flex h-11 w-11 items-center justify-center hover:bg-navy-700 disabled:opacity-40" disabled={qty <= 1} onClick={() => setQty(id, qty - 1)} aria-label="Diminuer la quantité"><Minus size={16} aria-hidden="true" /></button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button type="button" className="flex h-11 w-11 items-center justify-center hover:bg-navy-700 disabled:opacity-40" disabled={qty >= 99} onClick={() => setQty(id, qty + 1)} aria-label="Augmenter la quantité"><Plus size={16} aria-hidden="true" /></button>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <p className="display w-32 text-right text-2xl font-bold text-white">{formatPrice(qty * product.price)}</p>
                <button type="button" onClick={() => remove(id)} className="flex h-11 w-11 items-center justify-center text-steel-500 hover:text-red-400" aria-label={`Supprimer ${product.name}`}>
                  <Trash2 size={20} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-steel-700/40 bg-navy-900/60 p-6" aria-label="Récapitulatif">
          <h2 className="display text-3xl font-bold text-white">Récapitulatif</h2>
          <dl className="mt-5 space-y-3">
            <div className="flex justify-between"><dt className="text-steel-300">Articles</dt><dd>{count}</dd></div>
            <div className="flex justify-between border-t border-steel-700/40 pt-3">
              <dt className="text-steel-300">Total estimé HT</dt>
              <dd className="display text-3xl font-bold text-white">{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link to="/contact?sujet=devis" className="btn-volt mt-6 w-full justify-center">Demander un devis</Link>
          <button type="button" className="mt-3 w-full py-2 text-sm text-steel-500 hover:text-white" onClick={clear}>Vider le panier</button>
        </aside>
      </div>
    </Page>
  )
}
