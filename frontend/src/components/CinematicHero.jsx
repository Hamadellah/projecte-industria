
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scenes } from '../data/scenes'

gsap.registerPlugin(ScrollTrigger)

// Load all 40 WebP frames
const imageModules = import.meta.glob(
  '../images/ezgif-frame-*.webp',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
)

// Sort frames by their number
const frames = Object.entries(imageModules)
  .sort((a, b) => {
    const numberA = Number(a[0].match(/(\d+)\.webp$/)?.[1] || 0)
    const numberB = Number(b[0].match(/(\d+)\.webp$/)?.[1] || 0)

    return numberA - numberB
  })
  .map(([, imageUrl]) => imageUrl)

export default function CinematicHero() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const panelsRef = useRef([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!frames.length || !scenes.length) return

    const section = sectionRef.current
    const canvas = canvasRef.current
    const panels = panelsRef.current.filter(Boolean)

    if (!section || !canvas || !panels.length) return

    let cancelled = false
    let resizeObserver
    let context

    const ctx = canvas.getContext('2d', {
      alpha: false,
    })

    if (!ctx) return

    const loadedImages = []

    // Draw one frame with cover behavior
    const drawFrame = (frameIndex) => {
      const img = loadedImages[frameIndex]

      if (!img || !img.complete) return

      const rect = canvas.getBoundingClientRect()

      if (!rect.width || !rect.height) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      const width = Math.round(rect.width * dpr)
      const height = Math.round(rect.height * dpr)

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      const canvasWidth = rect.width
      const canvasHeight = rect.height

      const imageWidth = img.naturalWidth
      const imageHeight = img.naturalHeight

      const scale = Math.max(
        canvasWidth / imageWidth,
        canvasHeight / imageHeight
      )

      const sourceWidth = canvasWidth / scale
      const sourceHeight = canvasHeight / scale

      // Mobile focal point: 60%, desktop: center
      const focalX = window.innerWidth <= 768 ? 0.6 : 0.5

      const sourceX = Math.max(
        0,
        Math.min(
          imageWidth - sourceWidth,
          (imageWidth - sourceWidth) * focalX
        )
      )

      const sourceY = (imageHeight - sourceHeight) / 2

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvasWidth,
        canvasHeight
      )
    }

    const loadImages = async () => {
      try {
        // Load and decode all frames before starting animation
        await Promise.all(
          frames.map(async (src, index) => {
            const img = new Image()

            img.src = src

            await new Promise((resolve, reject) => {
              img.onload = resolve
              img.onerror = reject
            })

            if (img.decode) {
              try {
                await img.decode()
              } catch {
                // Image is already loaded; continue
              }
            }

            loadedImages[index] = img
          })
        )

        if (cancelled) return

        // Show first frame
        drawFrame(0)

        context = gsap.context(() => {
          const frameState = { value: 0 }
          const duration = Math.max(1, scenes.length - 1)

          gsap.set(panels, {
            autoAlpha: 0,
            y: 30,
          })

          gsap.set(panels[0], {
            autoAlpha: 1,
            y: 0,
          })

          const timeline = gsap.timeline({
            scrollTrigger: {
              id: 'industria-hero',
              trigger: section,
              pin: '.cine-stage',
              start: 'top top',
              end: '+=400%',
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,

              onUpdate: (self) => {
                const sceneIndex = Math.min(
                  scenes.length - 1,
                  Math.round(self.progress * (scenes.length - 1))
                )

                setActive((current) =>
                  current === sceneIndex ? current : sceneIndex
                )
              },
            },
          })

          // Scroll-controlled image sequence
          timeline.to(
            frameState,
            {
              value: loadedImages.length - 1,
              duration,
              ease: 'none',

              onUpdate: () => {
                drawFrame(
                  Math.round(frameState.value)
                )
              },
            },
            0
          )

          // Text transitions
          scenes.forEach((scene, index) => {
            if (index === 0) return

            const position = (index / scenes.length) * duration

            timeline.to(
              panels[index - 1],
              {
                autoAlpha: 0,
                y: -25,
                duration: 0.22,
                ease: 'power1.in',
              },
              position - 0.15
            )

            timeline.fromTo(
              panels[index],
              {
                autoAlpha: 0,
                y: 25,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.32,
                ease: 'power2.out',
              },
              position
            )
          })
        }, section)

        // Redraw on resize
        resizeObserver = new ResizeObserver(() => {
          const trigger = ScrollTrigger.getById('industria-hero')

          if (trigger) {
            const progress = trigger.progress
            const currentFrame = Math.round(
              progress * (loadedImages.length - 1)
            )

            drawFrame(currentFrame)
          } else {
            drawFrame(0)
          }

          ScrollTrigger.refresh()
        })

        resizeObserver.observe(canvas)

        ScrollTrigger.refresh()
      } catch (error) {
        console.error('INDUSTRIA image sequence loading error:', error)
      }
    }

    loadImages()

    return () => {
      cancelled = true

      resizeObserver?.disconnect()
      context?.revert()
    }
  }, [])

  // Navigate to a scene
  const goToScene = (index) => {
    const trigger = ScrollTrigger.getById('industria-hero')

    if (!trigger) return

    const progress = index / Math.max(1, scenes.length - 1)

    window.scrollTo({
      top: trigger.start + progress * (trigger.end - trigger.start),
      behavior: 'smooth',
    })
  }

  return (
    <section
      ref={sectionRef}
      className="cine-section"
      aria-label="Présentation INDUSTRIA"
    >
      <div className="cine-stage">

        {/* Canvas image sequence */}
        <div className="cine-images">
          <canvas
            ref={canvasRef}
            className="cine-canvas"
            role="img"
            aria-label="Machine de forage INDUSTRIA"
          />
        </div>

        <div className="cine-vignette" />

        {/* Content */}
        <div className="cine-content">

          <div className="cine-topline">
            <span className="cine-line" />
            <span>INDUSTRIA — EXPERTISE EN FORAGE</span>
          </div>

          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              ref={(element) => {
                panelsRef.current[index] = element
              }}
              className={`cine-panel ${index === 0 ? 'is-first' : ''}`}
            >
              <span className="cine-kicker">
                0{index + 1} / 0{scenes.length}
              </span>

              {index === 0 ? (
                <h1 className="display hero-title">
                  {scene.title}
                </h1>
              ) : (
                <h2 className="display scene-title">
                  {scene.title}
                </h2>
              )}

              <p>{scene.text}</p>

              {scene.cta && (
                <Link to="/catalogue" className="btn-volt cine-cta">
                  {scene.cta}
                  <ArrowRight size={20} aria-hidden="true" />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Progress navigation */}
        <div className="cine-progress">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              type="button"
              className={`cine-dot ${active === index ? 'on' : ''}`}
              onClick={() => goToScene(index)}
              aria-label={`Aller à la scène ${index + 1}`}
              aria-current={active === index ? 'step' : undefined}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint">
          <span>SCROLL POUR EXPLORER</span>
          <ChevronDown size={18} />
        </div>

        {/* Counter */}
        <div className="cine-counter">
          <span>{String(active + 1).padStart(2, '0')}</span>
          <span className="cine-counter-divider" />
          <span>{String(scenes.length).padStart(2, '0')}</span>
        </div>

      </div>
    </section>
  )
}
