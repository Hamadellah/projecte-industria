
import {
    Truck,
    ShieldCheck,
    BadgeCheck,
    Headset,
  } from "lucide-react";
  
  const benefits = [
    {
      icon: Truck,
      title: "Livraison nationale",
      text: "Partout au Maroc",
    },
    {
      icon: ShieldCheck,
      title: "Paiement sécurisé",
      text: "Vos achats en confiance",
    },
    {
      icon: BadgeCheck,
      title: "Qualité professionnelle",
      text: "Des produits sélectionnés",
    },
    {
      icon: Headset,
      title: "Conseils d’experts",
      text: "Une équipe à votre écoute",
    },
  ];
  
  export default function Benefits() {
    return (
      <section className="mx-auto max-w-[1240px] px-4 py-8">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-[#0077B6]">
                <Icon size={22} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#03045E] sm:text-sm">
                  {title}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  