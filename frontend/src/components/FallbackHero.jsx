import { Link } from 'react-router-dom'
import { ArrowRight, Drill } from 'lucide-react'
import { scenes } from '../data/scenes'

// Affiché quand WebGL est indisponible ou que le contexte graphique est perdu.
export default function FallbackHero() {
  return (
    <section className="blueprint" aria-label="Présentation INDUSTRIA">
      <div className="mx-auto max-w-6xl px-6 pt-36 pb-16">
        <p className="mb-6 inline-flex items-center gap-2 rounded-sm border border-volt-500/40 bg-navy-800/60 px-3 py-1.5 text-sm text-steel-300" role="status">
          <Drill size={16} aria-hidden="true" /> La visualisation 3D n’est pas disponible sur cet appareil. Voici la version simplifiée.
        </p>
        {scenes.map((s, i) => (
          <div key={s.id} className="border-t border-steel-700/50 py-12 md:py-16">
            {i === 0 ? <h1 className="display hero-title text-white">{s.title}</h1> : <h2 className="display scene-title text-white">{s.title}</h2>}
            <p className="mt-4 max-w-2xl text-lg text-steel-300">{s.text}</p>
            {s.cta && (
              <Link to="/catalogue" className="btn-volt mt-8 text-lg">
                {s.cta} <ArrowRight size={20} aria-hidden="true" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
