
import { Headphones, MapPin } from "lucide-react";
export default function TopBar() {
  return (
    <div className="hidden bg-[#03045E] text-white sm:block">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4 py-2 text-xs">
        <span className="flex items-center gap-2">
          <MapPin size={14} className="text-[#48CAE4]" />
          Livraison partout au Maroc
        </span>

        <div className="flex items-center gap-5 text-blue-100">
          <a href="#contact" className="flex items-center gap-1">
            <Headphones size={14} />
            Service client
          </a>
          <a href="#faq">Centre d’aide</a>
          <span>FR · MAD</span>
        </div>
      </div>
    </div>
  );
}
