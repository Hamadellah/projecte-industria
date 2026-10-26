import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#02033F] text-white">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a
            href="#accueil"
            className="text-xl font-black tracking-widest"
          >
            INDUSTRIA
          </a>
          <p className="mt-4 max-w-xs text-sm leading-6 text-blue-100/70">
            Votre partenaire pour le forage, le pompage et les fournitures
            industrielles au Maroc.
          </p>
        </div>

        <div>
          <h3 className="font-bold">Navigation</h3>
          <ul className="mt-4 space-y-3 text-sm text-blue-100/70">
            <li><a href="#accueil">Accueil</a></li>
            <li><a href="#categories">Catégories</a></li>
            <li><a href="#best-sellers">Meilleures ventes</a></li>
            <li><a href="#contact">Demander un devis</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Aide & services</h3>
          <ul className="mt-4 space-y-3 text-sm text-blue-100/70">
            <li><a href="#contact">Contactez-nous</a></li>
            <li><a href="#faq">Livraison & retours</a></li>
            <li><a href="#faq">Paiement sécurisé</a></li>
            <li><a href="#faq">Questions fréquentes</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Contact</h3>
          <div className="mt-4 space-y-4 text-sm text-blue-100/70">
            <p className="flex items-center gap-2">
              <Phone size={17} className="text-[#48CAE4]" />
              +212 5 00 00 00 00
            </p>
            <p className="flex items-center gap-2">
              <Mail size={17} className="text-[#48CAE4]" />
              contact@industria.ma
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={17} className="text-[#48CAE4]" />
              Maroc
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-blue-100/50">
        © {new Date().getFullYear()} INDUSTRIA. Tous droits réservés.
        Prix en dirhams marocains (DH).
      </div>
    </footer>
  );
}
