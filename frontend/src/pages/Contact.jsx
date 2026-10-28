
import {
  Building2,
  Phone,
  Mail,
  Truck,
  Wrench,
  Headset,
  Clock,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

const CONTACTS = [
  {
    id: "commercial",
    title: "Service commercial",
    description:
      "Informations sur nos produits, prix et solutions industrielles.",
    phone: "+212600000001",
    email: "commercial@example.com",
    icon: Building2,
    availability: "Lundi - Vendredi",
  },
  {
    id: "livraison",
    title: "Livraison et suivi",
    description:
      "Questions sur la livraison, les délais et le suivi des commandes.",
    phone: "+212600000002",
    email: "livraison@example.com",
    icon: Truck,
    availability: "Lundi - Vendredi",
  },
  {
    id: "technique",
    title: "Service technique et SAV",
    description:
      "Assistance technique, maintenance et service après-vente.",
    phone: "+212600000003",
    email: "support@example.com",
    icon: Wrench,
    availability: "Lundi - Vendredi",
  },
  {
    id: "client",
    title: "Service client",
    description:
      "Pour toute question générale concernant INDUSTRIA.",
    phone: "+212600000004",
    email: "contact@example.com",
    icon: Headset,
    availability: "Lundi - Samedi",
  },
];

function ContactCard({ contact }) {
  const Icon = contact.icon;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-steel-700/60 bg-navy-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-volt-400/60 hover:bg-navy-900">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-volt-400/20 bg-volt-400/10 text-volt-400">
          <Icon size={27} strokeWidth={1.8} />
        </div>

        <ArrowUpRight
          size={20}
          className="text-steel-500 transition group-hover:text-volt-400"
        />
      </div>

      <h3 className="mb-3 text-xl font-bold text-white">
        {contact.title}
      </h3>

      <p className="mb-6 min-h-[60px] text-sm leading-6 text-steel-400">
        {contact.description}
      </p>

      <div className="mb-5 flex items-center gap-2 text-xs text-steel-500">
        <Clock size={15} />
        <span>{contact.availability}</span>
      </div>

      <div className="mt-auto space-y-3 border-t border-steel-700/60 pt-5">
        <a
          href={`tel:${contact.phone}`}
          className="flex items-center gap-3 rounded-lg p-3 text-sm text-steel-300 transition hover:bg-volt-400/10 hover:text-volt-400"
        >
          <Phone size={17} className="shrink-0 text-volt-400" />
          <span>{contact.phone}</span>
        </a>

        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-3 rounded-lg p-3 text-sm text-steel-300 transition hover:bg-volt-400/10 hover:text-volt-400"
        >
          <Mail size={17} className="shrink-0 text-volt-400" />
          <span className="break-all">{contact.email}</span>
        </a>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <a
          href={`tel:${contact.phone}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-volt-400 px-3 py-3 text-sm font-bold text-navy-950 transition hover:bg-volt-500"
        >
          <Phone size={16} />
          Appeler
        </a>

        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-steel-700 px-3 py-3 text-sm font-semibold text-white transition hover:border-volt-400 hover:text-volt-400"
        >
          <Mail size={16} />
          E-mail
        </a>
      </div>
    </article>
  );
}

export default function Contact() {
  return (
    <main className="min-h-screen bg-abyss text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-steel-800/60">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="blueprint h-full w-full" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-volt-400/30 bg-volt-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-volt-400">
              <MessageCircle size={15} />
              Contact INDUSTRIA
            </span>

            <h1 className="display text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Parlons de vos
              <span className="block text-volt-400">
                besoins industriels.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-steel-400 sm:text-lg">
              Notre équipe vous accompagne dans le choix de vos
              équipements industriels, pompes, machines de forage
              et solutions d’irrigation.
            </p>

            <a
              href="#nos-services"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-volt-400 px-6 py-3.5 font-bold text-navy-950 transition hover:bg-volt-500"
            >
              Trouver le bon service
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact departments */}
      <section
        id="nos-services"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20"
      >
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-volt-400">
              Nos équipes
            </p>

            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Comment pouvons-nous vous aider ?
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-steel-400">
              Choisissez le service correspondant à votre besoin,
              puis contactez directement le responsable par téléphone
              ou par e-mail.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-steel-400">
            <Phone size={17} className="text-volt-400" />
            <span>Contact direct</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {CONTACTS.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </section>

      {/* General information */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-steel-700/60 bg-navy-900 p-7 sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-volt-400/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-white">
                Vous ne savez pas quel service contacter ?
              </h2>

              <p className="mt-3 leading-7 text-steel-400">
                Notre service client vous orientera vers le bon
                interlocuteur selon votre demande.
              </p>
            </div>

            <a
              href="mailto:contact@example.com"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-volt-400 px-6 py-4 font-bold text-navy-950 transition hover:bg-volt-500"
            >
              <Mail size={18} />
              Contacter INDUSTRIA
            </a>
          </div>
        </div>
      </section>

      {/* Temporary demo data notice */}
      <div className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
        <p className="text-xs leading-5 text-steel-500">
          Version de démonstration : les coordonnées affichées sont
          fictives. Remplacez-les par les coordonnées officielles
          avant la mise en production.
        </p>
      </div>
    </main>
  );
}
