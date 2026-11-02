import { Link } from 'react-router-dom'
import Page from '../components/Page'

export default function NotFound() {
  return (
    <Page title="Page introuvable">
      <h1 className="display scene-title text-white">Page introuvable.</h1>
      <p className="mt-4 text-steel-300">L’adresse demandée n’existe pas ou a été déplacée.</p>
      <Link to="/" className="btn-volt mt-8">Retour à l’accueil</Link>
    </Page>
  )
}
