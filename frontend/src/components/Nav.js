import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";
import { school } from "../data/school";

const menuLink =
  "text-[12px] font-semibold tracking-wider text-white/90 hover:text-white transition-colors";

const langs = [
  { code: "mk", label: "МК" },
  { code: "sq", label: "SQ" },
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
];

export default function Nav() {
  const { t, i18n } = useTranslation();

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="bg-gradient-to-b from-black/35 via-black/20 to-transparent">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between py-3">

            {/* LEFT MENU */}
            <nav className="hidden items-center gap-7 md:flex">
              <NavLink to="/za-nas"    className={menuLink}>{t("nav.about")}</NavLink>
              <NavLink to="/vesti"     className={menuLink}>{t("nav.news")}</NavLink>
              <NavLink to="/stipendii" className={menuLink}>{t("nav.scholarships")}</NavLink>
            </nav>

            {/* BRAND */}
            <Link to="/" className="mx-auto flex items-center gap-3 hover:opacity-90 transition">
              <div className="h-14 w-14 overflow-hidden">
                <img src={logo} alt="School logo" className="h-full w-full object-contain p-1" />
              </div>
              <div className="leading-tight text-white">
                <div className="text-base font-semibold">{school.name}</div>
                <div className="text-[11px] text-white/70">{school.website}</div>
              </div>
            </Link>

            {/* RIGHT MENU */}
            <nav className="hidden items-center gap-7 md:flex">
              <NavLink to="/kontakt"   className={menuLink}>{t("nav.contact")}</NavLink>
              <NavLink to="/profesori" className={menuLink}>{t("nav.teachers")}</NavLink>

              {/* Language switcher */}
              <div className="flex items-center gap-1 border-l border-white/20 pl-6">
                {langs.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => i18n.changeLanguage(l.code)}
                    className={
                      "rounded px-2 py-0.5 text-[11px] font-bold tracking-wider transition-all " +
                      (i18n.language === l.code
                        ? "bg-white/20 text-white"
                        : "text-white/50 hover:text-white/80")
                    }
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </nav>

          </div>
        </div>
        <div className="h-px bg-white/10" />
      </div>
    </header>
  );
}