import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Drill,
  Droplets,
  Search,
  Wrench,
} from "lucide-react";

const slides = [
  {
    label: "ÉTAPE 01",
    title: "Tout commence par une vision.",
    description:
      "Chaque projet mérite une solution adaptée. Découvrez les équipements et le savoir-faire nécessaires pour préparer vos travaux.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=85",
    icon: Search,
    category: "Étude & préparation",
  },
  {
    label: "ÉTAPE 02",
    title: "La précision au cœur du forage.",
    description:
      "Des équipements professionnels pour accompagner vos projets de forage et de puits dans les meilleures conditions.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1800&q=85",
    icon: Drill,
    category: "Forage & puits",
  },
  {
    label: "ÉTAPE 03",
    title: "L'eau, là où vous en avez besoin.",
    description:
      "Pompes, tuyaux et raccords : retrouvez les équipements essentiels pour vos installations de pompage.",
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1800&q=85",
    icon: Droplets,
    category: "Pompage & installation",
  },
  {
    label: "ÉTAPE 04",
    title: "La performance jusqu'au bout.",
    description:
      "Équipez vos installations avec des solutions professionnelles pensées pour accompagner vos projets industriels.",
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1800&q=85",
    icon: Wrench,
    category: "Équipements industriels",
  },
];

function Hero() {
  const [current, setCurrent] = useState(0);

  const slide = slides[current];
  const Icon = slide.icon;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="w-full bg-white">
      <div className="relative mx-auto w-full overflow-hidden bg-[#03045E]">
        {/* Background image */}
        <div
          key={slide.image}
          className="absolute inset-0 animate-hero-image"
          style={{
            backgroundImage: `url("${slide.image}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03045E]/95 via-[#03045E]/75 to-[#03045E]/20" />

        {/* Content */}
        <div className="relative mx-auto flex min-h-[480px] max-w-[1440px] items-center px-5 py-12 sm:min-h-[540px] sm:px-10 lg:min-h-[590px] lg:px-16">
          <div
            key={current}
            className="animate-hero-content w-full max-w-2xl text-white"
          >
            {/* Experience badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#48CAE4]/40 bg-[#0077B6]/30 px-4 py-2 backdrop-blur-sm">
              <CheckCircle2 size={17} className="text-[#48CAE4]" />
              <span className="text-xs font-semibold tracking-wide sm:text-sm">
                25 ans d'expérience dans le domaine
              </span>
            </div>

            {/* Step label */}
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#48CAE4]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#90E0EF]">
                {slide.label} — {slide.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-6xl">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-7 text-blue-50/90 sm:text-base sm:leading-8">
              {slide.description}
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/pompes"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#00B4D8] px-5 py-3 text-sm font-bold text-[#03045E] transition hover:bg-[#90E0EF] sm:px-6"
              >
                Découvrir nos produits
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/devis"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6"
              >
                Demander un devis
              </Link>
            </div>

            {/* Slider controls */}
            <div className="mt-10 flex items-center gap-4 sm:mt-12">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Étape précédente"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition hover:border-[#48CAE4] hover:bg-[#0077B6]"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Étape suivante"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition hover:border-[#48CAE4] hover:bg-[#0077B6]"
              >
                <ArrowRight size={18} />
              </button>

              <div className="flex flex-1 items-center gap-2">
                {slides.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setCurrent(index)}
                    aria-label={`Afficher ${item.category}`}
                    aria-current={current === index ? "step" : undefined}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      current === index
                        ? "w-10 bg-[#48CAE4] sm:w-14"
                        : "w-5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs font-semibold tracking-widest text-white/80">
                0{current + 1} / 0{slides.length}
              </span>
            </div>
          </div>

          {/* Floating step indicator */}
          <div className="absolute bottom-6 right-6 hidden rounded-xl border border-white/20 bg-[#03045E]/50 p-4 text-white backdrop-blur-md lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#00B4D8]/20 text-[#48CAE4]">
                <Icon size={23} />
              </div>
              <div>
                <p className="text-xs text-blue-100/70">Découvrez notre expertise</p>
                <p className="mt-1 text-sm font-bold">{slide.category}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider progress */}
      <div className="h-1 w-full bg-[#CAF0F8]">
        <div
          className="h-full bg-[#00B4D8] transition-all duration-500"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }}
        />
      </div>
    </section>
  );
}

export default Hero;