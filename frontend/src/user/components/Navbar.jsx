
const links = [
    "Forage & puits",
    "Pompes",
    "Tuyaux & raccords",
    "Outillage",
    "Protection",
    "Promotions",
  ];
  
  export default function Navbar() {
    return (
      <nav className="hidden border-b border-slate-100 bg-white md:block">
        <div className="mx-auto flex h-12 max-w-[1240px] items-center gap-7 px-4 text-sm">
          <a
            href="#categories"
            className="whitespace-nowrap font-bold text-[#03045E]"
          >
            Toutes les catégories
          </a>
  
          {links.map((link) => (
            <a
              key={link}
              href={link === "Pompes" ? "#best-sellers" : "#categories"}
              className={`whitespace-nowrap text-[13px] transition hover:text-[#0077B6] ${
                link === "Promotions"
                  ? "font-bold text-red-600"
                  : "font-medium text-slate-600"
              }`}
            >
              {link}
            </a>
          ))}
        </div>
      </nav>
    );
  }
  