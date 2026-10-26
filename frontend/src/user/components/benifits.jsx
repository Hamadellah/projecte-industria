import {
    Award,
    Headset,
    PackageCheck,
    Truck,
  } from "lucide-react";
  
  const benefits = [
    {
      icon: Award,
      title: "Une expertise reconnue",
      description: "Un accompagnement basé sur l'expérience du domaine.",
    },
    {
      icon: PackageCheck,
      title: "Des produits sélectionnés",
      description: "Des équipements adaptés à vos besoins professionnels.",
    },
    {
      icon: Headset,
      title: "Un conseil personnalisé",
      description: "Nous vous aidons à choisir les bonnes références.",
    },
    {
      icon: Truck,
      title: "Livraison & disponibilité",
      description: "Contactez-nous pour connaître les délais et conditions.",
    },
  ];
  
  function Benefits() {
    return (
      <section className="w-full bg-white px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
  
            return (
              <div
                key={benefit.title}
                className="group flex items-center gap-4 p-5 transition hover:bg-[#CAF0F8]/30 sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#CAF0F8] text-[#0077B6] transition group-hover:bg-[#0077B6] group-hover:text-white">
                  <Icon size={24} strokeWidth={1.8} />
                </div>
  
                <div>
                  <h3 className="text-sm font-bold text-[#03045E] sm:text-base">
                    {benefit.title}
                  </h3>
  
                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
  
  export default Benefits;