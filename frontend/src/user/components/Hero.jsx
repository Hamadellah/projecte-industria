
import { ArrowRight, Truck, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section id="accueil" className="mx-auto max-w-[1240px] px-4 pt-6">
      <div className="relative isolate overflow-hidden rounded-3xl bg-[#03045E]">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=85"
          alt="Chantier et équipements industriels"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#03045E]/95 via-[#023E8A]/80 to-[#023E8A]/20" />

        <div className="max-w-2xl px-6 py-16 text-white sm:px-12 sm:py-24">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-sky-100">
            Votre partenaire industriel au Maroc
          </span>

          <h1 className="mt-6 text-3xl font-extrabold leading-tight sm:text-5xl">
            La puissance au service de vos projets
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-blue-100 sm:text-base">
            Tout pour le forage, le pompage et l’industrie. Des équipements
            professionnels pour accompagner vos chantiers.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#best-sellers"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00B4D8] px-6 py-4 text-sm font-bold text-[#03045E] transition hover:bg-[#90E0EF]"
            >
              Découvrir nos produits
              <ArrowRight size={18} />
            </a>

            <a
              href="#contact"
              className="rounded-xl border border-white/40 px-6 py-4 text-center text-sm font-semibold text-white hover:bg-white/10"
            >
              Demander un devis
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-5 text-xs text-sky-100">
            <span className="flex items-center gap-2">
              <Truck size={16} /> Livraison nationale
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} /> Achat en confiance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
