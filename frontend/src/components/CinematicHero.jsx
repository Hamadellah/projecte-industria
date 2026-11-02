import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createDrillScene } from '../3d/drillScene'
import FallbackHero from './FallbackHero'
import { scenes } from '../data/scenes'

gsap.registerPlugin(ScrollTrigger)

// Positions de caméra clés (une par séquence). Interpolées au scroll.
const KEYS = [
  { px: 14, py: 6.5, pz: 17, lx: 1.4, ly: 4.2, lz: 0, rot: 0, depth: 0, strata: 0, water: 0 },
  { px: 5.8, py: 7.6, pz: 6, lx: 2.8, ly: 6.4, lz: 0, rot: -1.1, depth: 0.15, strata: 0, water: 0 },
  { px: 5.3, py: -0.6, pz: 9, lx: 2.8, ly: -1.6, lz: 0, rot: -2.0, depth: 1, strata: 1, water: 0 },
  { px: 10.4, py: 0.4, pz: 12.5, lx: 2.4, ly: -1.3, lz: 0, rot: -3.0, depth: 1, strata: 1, water: 1 },
  { px: 17, py: 8, pz: 19, lx: 1.5, ly: 3, lz: 0, rot: -3.9, depth: 1, strata: 0.3, water: 1 },
]

export default function CinematicHero() {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const hostRef = useRef(null)
  const panelRefs = useRef([])
  const hintRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const host = hostRef.current
    if (!host || failed) return undefined

    // Canvas créé à chaque montage : compatible React Strict Mode (double effet en dev),
    // car un contexte WebGL perdu volontairement au cleanup ne peut pas être réutilisé.
    const canvas = document.createElement('canvas')
    canvas.className = 'cine-canvas'
    canvas.setAttribute('role', 'img')
    canvas.setAttribute('aria-label', 'Foreuse de puits d’eau en 3D')
    host.appendChild(canvas)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let api
    try {
      api = createDrillScene(canvas, { reducedMotion: reduced, onContextLost: () => setFailed(true) })
    } catch (err) {
      console.warn('[INDUSTRIA] WebGL indisponible, affichage de secours.', err)
      canvas.remove()
      setFailed(true)
      return undefined
    }

    const { state } = api
    if (import.meta.env.DEV) window.__industria = api // diagnostic dev uniquement
    Object.assign(state, KEYS[0])

    const io = new IntersectionObserver(([entry]) => api.setActive(entry.isIntersecting), { threshold: 0 })
    io.observe(stageRef.current)

    const ctx = gsap.context(() => {
      const panels = panelRefs.current
      gsap.set(panels.slice(1), { autoAlpha: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 5.5)}`,
          pin: stageRef.current,
          scrub: reduced ? true : 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(scenes.length - 1, Math.floor(self.progress * 5.2 + 0.02))
            setActive((prev) => (prev === idx ? prev : idx))
          },
        },
      })

      // Caméra et machine : une séquence = 1 unité de temps
      for (let i = 1; i < KEYS.length; i++) tl.to(state, { ...KEYS[i], duration: 1 }, i - 1 + 0.35)
      tl.to(state, { duration: 0.35 }, 0) // temps mort initial
      tl.to(hintRef.current, { autoAlpha: 0, duration: 0.2 }, 0)

      // Textes : entrée / sortie synchronisées sur chaque séquence
      panels.forEach((el, i) => {
        const inner = el.children
        if (i > 0) {
          tl.to(el, { autoAlpha: 1, duration: 0.18 }, i - 0.02)
          if (!reduced) tl.fromTo(inner, { y: 40 }, { y: 0, stagger: 0.04, duration: 0.25 }, i - 0.02)
        }
        if (i < panels.length - 1) {
          tl.to(el, { autoAlpha: 0, duration: 0.14 }, i + 0.82)
          if (!reduced) tl.to(inner, { y: -30, duration: 0.14 }, i + 0.82)
        }
      })
      tl.to({}, { duration: 0.2 }, KEYS.length) // maintien final avant de libérer la scène
    }, wrapRef)

    const onFonts = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(onFonts)

    return () => {
      ctx.revert() // tue le timeline, le ScrollTrigger et retire le pin
      io.disconnect()
      api.dispose()
      canvas.remove()
    }
  }, [failed])

  if (failed) return <FallbackHero />

  return (
    <section ref={wrapRef} aria-label="Présentation cinématique d’une foreuse INDUSTRIA">
      <div ref={stageRef} className="cine-stage">
        <div ref={hostRef} className="cine-host" />
        <div className="cine-vignette" />

        {scenes.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => (panelRefs.current[i] = el)}
            className={`cine-panel ${i === 0 ? 'is-first' : ''}`}
            aria-hidden={active !== i}
          >
            {i === 0 ? (
              <h1 className="display hero-title text-white">{s.title}</h1>
            ) : (
              <h2 className="display scene-title text-white">{s.title}</h2>
            )}
            <p className="mt-5 max-w-xl text-lg md:text-xl text-steel-300 leading-relaxed">{s.text}</p>
            {s.cta && (
              <div className="mt-8">
                <Link to="/catalogue" className="btn-volt text-lg">
                  {s.cta}
                  <ArrowRight size={20} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        ))}

        <div className="cine-progress" aria-hidden="true">
          {scenes.map((s, i) => (
            <span key={s.id} className={`cine-dot ${active === i ? 'on' : ''}`} />
          ))}
        </div>

        <div ref={hintRef} className="scroll-hint">
          <span>Faites défiler</span>
          <ChevronDown className="nudge" size={20} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
