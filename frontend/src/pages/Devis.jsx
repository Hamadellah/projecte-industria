import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, FileText, Send } from 'lucide-react'
import Page from '../components/Page'
import { getStoreProduct } from '../services/storeService'
import { formatPrice } from '../data/products'
import { apiRequest } from '../services/api' // تأكد من المسار الحقيقي لـ api.js

export default function Devis() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const productId = searchParams.get('product')
  const initialQty = searchParams.get('qty') || 1

  const [product, setProduct] = useState(null)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    quantity: initialQty,
  })

  // جلب معلومات المنتج إيلا كان محدد في الـ URL
  useEffect(() => {
    if (productId) {
      setLoadingProduct(true)
      getStoreProduct(productId)
        .then((data) => {
          setProduct(data)
        })
        .catch((err) => {
          console.error('Erreur chargement produit pour devis:', err)
        })
        .finally(() => {
          setLoadingProduct(false)
        })
    } else {
      setLoadingProduct(false)
    }
  }, [productId])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // إرسال طلب الديڤيس للـ Backend عبر apiRequest
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = {
      product_id: productId ? Number(productId) : null,
      quantity: Number(formData.quantity),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      notes: formData.notes,
    }

    try {
      await apiRequest('/quotations', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setSuccess(true)
    } catch (err) {
      console.error('Erreur :', err)
      setError(err.message || "Une erreur est survenue lors de l'envoi de votre demande.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <Page title="Demande de devis réussie">
        <div className="mx-auto max-w-xl py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-volt-400/20 text-volt-400">
            <CheckCircle size={36} />
          </div>
          <h1 className="display mt-6 text-4xl font-bold text-white">
            Demande envoyée avec succès !
          </h1>
          <p className="mt-4 text-steel-300">
            Merci pour votre demande de devis. Notre équipe commerciale traitera votre dossier dans les plus brefs délais.
          </p>
          <button
            onClick={() => navigate('/catalogue')}
            className="btn-volt mt-8"
          >
            Retour au catalogue
          </button>
        </div>
      </Page>
    )
  }

  return (
    <Page title="Demander un devis" wide>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-steel-300 hover:text-white"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Retour
      </button>

      <div className="mx-auto mt-8 max-w-3xl">
        <div className="flex items-center gap-3 border-b border-steel-700/60 pb-5">
          <FileText className="text-volt-400" size={32} />
          <div>
            <h1 className="display text-3xl font-bold text-white">Demande de devis</h1>
            <p className="text-sm text-steel-400">Remplissez le formulaire ci-dessous pour recevoir votre offre personnalisée.</p>
          </div>
        </div>

        {/* إيلا كان المنتج محدد، كيبان الملخص ديالو الفوق */}
        {productId && (
          <div className="mt-6 flex items-center gap-4 rounded-xl border border-volt-400/30 bg-navy-800/60 p-4">
            {loadingProduct ? (
              <p className="text-sm text-steel-400">Chargement du produit...</p>
            ) : product ? (
              <div className="flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-volt-400">Produit concerné</span>
                <h3 className="text-lg font-medium text-white">{product.name}</h3>
                <p className="text-xs text-steel-400">Réf: {product.reference} • Prix unitaire: {formatPrice(product.price)}</p>
              </div>
            ) : (
              <p className="text-sm text-red-400">Produit introuvable.</p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-steel-300">Nom complet *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-steel-700 bg-navy-900 px-4 py-3 text-white focus:border-volt-400 focus:outline-none"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-300">Email professionnel *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-steel-700 bg-navy-900 px-4 py-3 text-white focus:border-volt-400 focus:outline-none"
                placeholder="email@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-300">Téléphone *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-steel-700 bg-navy-900 px-4 py-3 text-white focus:border-volt-400 focus:outline-none"
                placeholder="+212 6..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-300">Nom de l'entreprise (Optionnel)</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-steel-700 bg-navy-900 px-4 py-3 text-white focus:border-volt-400 focus:outline-none"
                placeholder="Votre société"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-steel-300">Quantité demandée *</label>
              <input
                type="number"
                name="quantity"
                min="1"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-steel-700 bg-navy-900 px-4 py-3 text-white focus:border-volt-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-steel-300">Remarques ou spécifications particulières</label>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-steel-700 bg-navy-900 px-4 py-3 text-white focus:border-volt-400 focus:outline-none"
              placeholder="Précisez vos besoins spécifiques..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-volt flex w-full items-center justify-center gap-2 py-4 text-base font-semibold disabled:opacity-50"
          >
            <Send size={18} />
            {submitting ? 'Envoi en cours...' : 'Envoyer la demande de devis'}
          </button>
        </form>
      </div>
    </Page>
  )
}