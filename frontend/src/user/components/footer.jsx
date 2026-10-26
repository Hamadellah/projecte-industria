import { Link } from "react-router-dom";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const categories = [
  { name: "Forage & puits", slug: "forage-puits" },
  { name: "Pompes", slug: "pompes" },
  { name: "Tuyaux & raccords", slug: "tuyaux-raccords" },
  { name: "Outillage", slug: "outillage" },
  { name: "Protection", slug: "protection" },
];

function Footer() {
  return (
    <footer className="w-full bg-[#03045E] text-white">
      <div className="mx-auto max-w-[1440px] px-5 pt-14 sm:px-8 lg:px-12 lg:pt-16">
        {/* Newsletter / contact banner */}
        <div className="mb-12 flex flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8 lg:flex-row lg:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#48CAE4]">
              Parlons de votre projet
            </p>
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Besoin d'un renseignement ?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/70">
              Notre équipe est disponible pour répondre à vos questions sur
              nos produits et équipements.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#00B4D8] px-6 py-3 text-sm font-bold text-[#03045E] transition hover:bg-[#90E0EF]"
          >
            Contactez-nous
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Footer columns */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00B4D8] text-xl font-black text-[#03045E]">
                I
              </div>
              <span className="text-2xl font-extrabold tracking-[0.12em]">
                INDUSTRIA
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-blue-100/70">
              Votre partenaire pour découvrir des équipements industriels,
              des solutions de pompage et du matériel professionnel.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 transition hover:bg-[#0077B6]"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 transition hover:bg-[#0077B6]"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 transition hover:bg-[#0077B6]"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-5 text-base font-bold">Navigation</h3>
            <ul className="space-y-3 text-sm text-blue-100/70">
              <li>
                <Link className="transition hover:text-[#48CAE4]" to="/">
                  Accueil
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-[#48CAE4]" to="/produits">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-[#48CAE4]" to="/categories">
                  Nos catégories
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-[#48CAE4]" to="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-[#48CAE4]" to="/devis">
                  Demander un devis
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 text-base font-bold">Nos catégories</h3>
            <ul className="space-y-3 text-sm text-blue-100/70">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/categories/${category.slug}`}
                    className="transition hover:text-[#48CAE4]"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact details */}
          <div>
            <h3 className="mb-5 text-base font-bold">Contact</h3>
            <ul className="space-y-5 text-sm text-blue-100/70">
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-[#48CAE4]" />
                <span>Numéro de téléphone à ajouter</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-[#48CAE4]" />
                <span>Email à ajouter</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#48CAE4]" />
                <span>Adresse à ajouter</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 py-6 text-xs text-blue-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} INDUSTRIA. Tous droits réservés.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/confidentialite" className="hover:text-white">
              Politique de confidentialité
            </Link>
            <Link to="/conditions" className="hover:text-white">
              Conditions générales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;