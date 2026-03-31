import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { school } from "../data/school";

const langs = [
  { code: "mk", label: "МК" },
  { code: "sq", label: "SQ" },
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
];

export default function Nav() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const menuLink = "text-[12px] font-semibold tracking-wider text-white/90 hover:text-white transition-colors";

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="bg-gradient-to-b from-black/35 via-black/20 to-transparent">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between py-3">

            {/* LEFT MENU — desktop only */}
            <nav className="hidden items-center gap-7 md:flex">
              <NavLink to="/za-nas"    className={menuLink}>{t("nav.about")}</NavLink>
              <NavLink to="/vesti"     className={menuLink}>{t("nav.news")}</NavLink>
              <NavLink to="/stipendii" className={menuLink}>{t("nav.scholarships")}</NavLink>
            </nav>

            {/* BRAND */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition md:mx-auto">
              <div className="h-14 w-14 overflow-hidden shrink-0">
                <img src={logo} alt="School logo" className="h-full w-full object-contain p-1" />
              </div>
              <div className="leading-tight text-white">
                <div className="text-base font-semibold">{school.name}</div>
                <div className="text-[11px] text-white/70">{school.website}</div>
              </div>
            </Link>

            {/* RIGHT MENU — desktop only */}
            <nav className="hidden items-center gap-7 md:flex">
              <NavLink to="/kontakt"   className={menuLink}>{t("nav.contact")}</NavLink>
              <NavLink to="/profesori" className={menuLink}>{t("nav.teachers")}</NavLink>
              {/* Language switcher */}
              <div className="flex items-center gap-1 border-l border-white/20 pl-6">
                {langs.map((l) => (
                  <button key={l.code} onClick={() => i18n.changeLanguage(l.code)}
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

            {/* HAMBURGER — mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="ml-auto flex md:hidden flex-col items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>

          </div>
        </div>
        <div className="h-px bg-white/10" />
      </div>

      {/* MOBILE MENU DROPDOWN */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-40 bg-[#000]/40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <div className={`
          fixed bottom-0 left-0 right-0 z-50 md:hidden
          bg-white rounded-t-2xl border-t border-slate-200 pb-8
          transition-transform duration-300 ease-out
          ${menuOpen ? "translate-y-0" : "translate-y-full"}
        `}>
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-3">
            <div className="w-8 h-0.5 bg-slate-300 rounded-full" />
          </div>

          {/* Nav links */}
          <nav className="px-2 space-y-0.5">
            {[
              { to: "/za-nas",    label: t("nav.about") },
              { to: "/vesti",     label: t("nav.news") },
              { to: "/stipendii", label: t("nav.scholarships") },
              { to: "/kontakt",   label: t("nav.contact") },
              { to: "/profesori", label: t("nav.teachers") },
            ].map(({ to, label }) => (
              <NavLink
                key={to} to={to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors ` +
                  (isActive
                    ? "bg-[#EFF4FB] text-[#0B2E5B] font-bold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-[#0B2E5B]")
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{label}</span>
                    {isActive
                      ? <span className="w-1.5 h-1.5 rounded-full bg-[#0B2E5B]" />
                      : <span className="text-slate-400 text-sm">›</span>
                    }
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="h-px bg-slate-200 mx-4 my-3" />

          {/* Language switcher */}
          <div className="flex items-center gap-1.5 px-5">
            <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase mr-2">Lang</span>
            {langs.map((l) => (
              <button key={l.code} onClick={() => i18n.changeLanguage(l.code)}
                className={
                  "rounded-lg px-2.5 py-1.5 text-[11px] font-bold tracking-wider border transition-all " +
                  (i18n.language === l.code
                    ? "bg-[#0B2E5B] text-white border-[#0B2E5B]"
                    : "text-slate-400 border-transparent hover:text-[#0B2E5B] hover:border-slate-200")
                }
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
    </header>
  );
}