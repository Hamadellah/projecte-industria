import { useEffect } from 'react'

// Conteneur de page : titre du document + décalage sous l'en-tête fixe.
export default function Page({ title, children, wide = false }) {
  useEffect(() => {
    document.title = title ? `${title} — INDUSTRIA` : 'INDUSTRIA — L’excellence du forage'
    window.scrollTo(0, 0)
  }, [title])
  return <main className={`mx-auto px-5 pb-24 pt-28 md:px-8 md:pt-36 ${wide ? 'max-w-7xl' : 'max-w-5xl'}`}>{children}</main>
}
