import { ArrowRight, ClipboardList } from "lucide-react";

export default function QuoteBanner() {
  return (
    <section id="contact" className="mx-auto max-w-[1240px] px-4 py-10">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#03045E] p-6 text-white sm:p-10 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          <div className="hidden rounded-xl bg-white/10 p-4 text-[#48CAE4] sm:block">
            <ClipboardList size={28} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#48CAE4]">
              Accompagnement sur mesure
            </p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Un projet industriel ?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
              Parlez-nous de votre besoin et obtenez une proposition adaptée
              à votre chantier.
            </p>
          </div>
        </div>

        <a
          href="mailto:contact@industria.ma?subject=Demande%20de%20devis"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00B4D8] px-5 py-4 text-sm font-bold text-[#03045E] hover:bg-[#90E0EF]"
        >
          Demander votre devis <ArrowRight size={17} />
        </a>
      </div>
    </section>
  );
}
