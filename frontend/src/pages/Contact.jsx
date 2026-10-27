import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import Page from '../components/Page'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+()\d\s.-]{6,20}$/

function validate(v) {
  const e = {}
  if (v.nom.trim().length < 2) e.nom = 'Indiquez votre nom (2 caractères minimum).'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Saisissez une adresse e-mail valide, par exemple nom@entreprise.com.'
  if (v.telephone.trim() && !PHONE_RE.test(v.telephone.trim())) e.telephone = 'Numéro invalide : chiffres, espaces, +, ( ), . ou - uniquement.'
  if (v.message.trim().length < 20) e.message = `Décrivez votre besoin en 20 caractères minimum (${v.message.trim().length} actuellement).`
  return e
}

function Field({ id, label, error, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-medium text-steel-100">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-steel-500">{hint}</p>}
      {error && <p id={`${id}-error`} className="field-error" role="alert">{error}</p>}
    </div>
  )
}

export default function Contact() {
  const [params] = useSearchParams()
  const { items, total, clear } = useCart()
  const [values, setValues] = useState({
    nom: '', entreprise: '', email: '', telephone: '',
    sujet: params.get('sujet') === 'devis' ? 'devis' : 'information',
    message: '', joindre: items.length > 0,
  })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((v) => ({ ...v, [k]: value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0]
      document.getElementById(first)?.focus()
      return
    }
    // Démo : aucun envoi réel. On confirme la validation côté client uniquement.
    setDone({ nom: values.nom.trim(), email: values.email.trim(), lignes: values.joindre ? items.length : 0 })
  }

  if (done) {
    return (
      <Page title="Demande validée">
        <div className="border border-volt-500/50 bg-navy-900/60 p-8 md:p-12" role="status">
          <Check className="text-volt-400" size={40} aria-hidden="true" />
          <h1 className="display mt-4 text-5xl font-extrabold text-white">Formulaire validé.</h1>
          <p className="mt-4 max-w-xl text-lg text-steel-300">
            Merci {done.nom}. Ceci est un site de démonstration : aucun message n’a été envoyé et aucun serveur n’a reçu vos données.
            {done.lignes > 0 && ` Votre demande aurait inclus ${done.lignes} ligne${done.lignes > 1 ? 's' : ''} de panier.`}
          </p>
          <button type="button" className="btn-ghost mt-8" onClick={() => { setDone(null); setValues((v) => ({ ...v, message: '' })) }}>Remplir un nouveau formulaire</button>
        </div>
      </Page>
    )
  }

  const aria = (k) => ({ 'aria-invalid': errors[k] ? 'true' : 'false', 'aria-describedby': errors[k] ? `${k}-error` : undefined })

  return (
    <Page title="Contact et devis">
      <h1 className="display scene-title text-white">Devis et contact</h1>
      <p className="mt-4 max-w-2xl text-lg text-steel-300">Décrivez votre projet de forage : profondeur visée, type de terrain, débit recherché.</p>
      <p className="mt-2 text-steel-500">Formulaire de démonstration : la validation se fait dans votre navigateur et rien n’est envoyé.</p>

      <form onSubmit={onSubmit} noValidate className="mt-10 grid gap-6 md:grid-cols-2">
        <Field id="nom" label="Nom et prénom" error={errors.nom}>
          <input id="nom" className="field" value={values.nom} onChange={set('nom')} autoComplete="name" {...aria('nom')} />
        </Field>
        <Field id="entreprise" label="Entreprise (facultatif)">
          <input id="entreprise" className="field" value={values.entreprise} onChange={set('entreprise')} autoComplete="organization" />
        </Field>
        <Field id="email" label="E-mail" error={errors.email}>
          <input id="email" type="email" className="field" value={values.email} onChange={set('email')} autoComplete="email" {...aria('email')} />
        </Field>
        <Field id="telephone" label="Téléphone (facultatif)" error={errors.telephone}>
          <input id="telephone" type="tel" className="field" value={values.telephone} onChange={set('telephone')} autoComplete="tel" {...aria('telephone')} />
        </Field>
        <div className="md:col-span-2">
          <Field id="sujet" label="Votre demande">
            <select id="sujet" className="field" value={values.sujet} onChange={set('sujet')}>
              <option value="devis">Demande de devis</option>
              <option value="information">Information technique</option>
              <option value="sav">Pièces et service après-vente</option>
            </select>
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field id="message" label="Message" error={errors.message}>
            <textarea id="message" rows={6} className="field" value={values.message} onChange={set('message')} {...aria('message')} />
          </Field>
        </div>

        {items.length > 0 && (
          <fieldset className="md:col-span-2 border border-steel-700/40 p-5">
            <legend className="px-2 font-medium text-steel-100">Panier</legend>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 h-5 w-5 accent-[#1e6bff]" checked={values.joindre} onChange={set('joindre')} />
              <span>Joindre mon panier à la demande ({items.length} ligne{items.length > 1 ? 's' : ''}, {formatPrice(total)} HT estimé)</span>
            </label>
          </fieldset>
        )}

        <div className="md:col-span-2 flex flex-wrap gap-4">
          <button type="submit" className="btn-volt">Valider le formulaire</button>
          {items.length > 0 && <button type="button" className="btn-ghost" onClick={clear}>Vider le panier</button>}
        </div>
      </form>
    </Page>
  )
}
