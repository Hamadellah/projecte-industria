
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scenes } from '../data/scenes'

gsap.registerPlugin(ScrollTrigger)

const HERO_IMAGES = [
  'https://www.maadialna.ma/sites/default/files/2023-06/whatsapp-image-2023-06-30-at-19.12.41.jpeg',
  'https://image.made-in-china.com/2f0j00BOnbTkQPfCcq/Crawler-Drilling-Rig-Water-Well-Drilling-Rig-Machine-Driven-by-Diesel-Engine.jpg',
  'https://www.jcdrill.com/data/watermark/20230623/649546825a428.jpg',
  'https://cloudfront-eu-central-1.images.arcpublishing.com/le360/ST4F5EWH7FH4HA36TWATUL64JA.jpg',
  'https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D1920%2Cfit%3Dcrop/m2WEnJ6vy0U04bqp/chatgpt-image-jul-19-2025-07_03_01-pm-YrDJw66OvlHV4nng.png',
]

export default function CinematicHero() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current

    if (!section || !stage) return

    const images = gsap.utils.toArray('.cine-image', stage)
    const panels = gsap.utils.toArray('.cine-panel', stage)

    if (!images.length || !panels.length) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reducedMotion) {
      gsap.set(images, { autoAlpha: 0 })
      gsap.set(images[0], { autoAlpha: 1, scale: 1 })

      gsap.set(panels, { autoAlpha: 0 })
      gsap.set(panels[0], { autoAlpha: 1 })

      return
    }

    const ctx = gsap.context(() => {
      gsap.set(images, {
        autoAlpha: 0,
        scale: 1.12,
      })

      gsap.set(images[0], {
        autoAlpha: 1,
        scale: 1,
      })

      gsap.set(panels, {
        autoAlpha: 0,
        y: 35,
      })

      gsap.set(panels[0], {
        autoAlpha: 1,
        y: 0,
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'industria-hero',
          trigger: section,
          pin: stage,
          start: 'top top',
          end: '+=450%',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const index = Math.min(
              scenes.length - 1,
              Math.round(self.progress * (scenes.length - 1))
            )

            setActive((current) =>
              current === index ? current : index
            )
          },
        },
      })

      for (let i = 1; i < scenes.length; i++) {
        const position = i - 1

        // Image précédente
        timeline.to(
          images[i - 1],
          {
            autoAlpha: 0,
            scale: 1.1,
            duration: 0.55,
            ease: 'power2.inOut',
          },
          position
        )

        // Image suivante
        timeline.to(
          images[i],
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
          },
          position
        )

        // Texte précédent
        timeline.to(
          panels[i - 1],
          {
            autoAlpha: 0,
            y: -25,
            duration: 0.3,
            ease: 'power2.in',
          },
          position
        )

        // Nouveau texte
        timeline.fromTo(
          panels[i],
          {
            autoAlpha: 0,
            y: 30,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
          },
          position + 0.2
        )
      }

      // Rafraîchir ScrollTrigger après le chargement des polices
      document.fonts?.ready?.then(() => {
        ScrollTrigger.refresh()
      })
    }, section)

    const refresh = () => ScrollTrigger.refresh()

    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
      ScrollTrigger.getById('industria-hero')?.kill()
    }
  }, [])

  const goToScene = (index) => {
    const trigger = ScrollTrigger.getById('industria-hero')

    if (!trigger) return

    const progress = index / (scenes.length - 1)

    const target =
      trigger.start + progress * (trigger.end - trigger.start)

    window.scrollTo({
      top: target,
      behavior: 'smooth',
    })
  }

  return (
    <section
      ref={sectionRef}
      className="cine-section"
      aria-label="Présentation INDUSTRIA"
    >
      <div ref={stageRef} className="cine-stage">

        {/* Background image reel */}
        <div className="cine-images" aria-hidden="true">
          {HERO_IMAGES.map((src, index) => (
            <div
              key={src}
              className={`cine-image ${
                index === 0 ? 'is-first' : ''
              }`}
              style={{
                backgroundImage: `url("${src}")`,
              }}
            />
          ))}
        </div>

        {/* Cinematic overlay */}
        <div className="cine-vignette" aria-hidden="true" />

        {/* Main content */}
        <div className="cine-content">

          <div className="cine-topline">
            <span className="cine-line" />
            <span>INDUSTRIA · EXPERTISE FORAGE</span>
          </div>

          {scenes.map((scene, index) => (
            <article
              key={scene.id}
              className={`cine-panel ${
                index === 0 ? 'is-first' : ''
              }`}
              aria-hidden={active !== index}
            >
              <span className="cine-kicker">
                25 ANS D'EXPÉRIENCE
              </span>

              {index === 0 ? (
                <h1 className="display hero-title text-white">
                  {scene.title}
                </h1>
              ) : (
                <h2 className="display scene-title text-white">
                  {scene.title}
                </h2>
              )}

              <p className="cine-description">
                {scene.text}
              </p>

              {scene.cta && (
                <Link
                  to="/catalogue"
                  className="btn-volt cine-cta"
                >
                  {scene.cta}
                  <ArrowRight size={19} aria-hidden="true" />
                </Link>
              )}
            </article>
          ))}
        </div>

        {/* Scene progress */}
        <div
          className="cine-progress"
          aria-label="Étapes de présentation"
        >
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              type="button"
              className={`cine-dot ${
                active === index ? 'on' : ''
              }`}
              onClick={() => goToScene(index)}
              aria-label={`Aller à l'étape ${index + 1}`}
              aria-current={
                active === index ? 'step' : undefined
              }
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="scroll-hint">
          <span>FAITES DÉFILER</span>
          <ChevronDown
            className="nudge"
            size={22}
            aria-hidden="true"
          />
        </div>

        {/* Counter */}
        <div className="cine-counter" aria-live="polite">
          <span>0{active + 1}</span>
          <span className="cine-counter-divider" />
          <span>0{scenes.length}</span>
        </div>

      </div>
    </section>
  )
}
