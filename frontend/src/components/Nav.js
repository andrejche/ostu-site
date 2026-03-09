import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { school } from "../data/school";

const menuLink =
  "text-[12px] font-semibold tracking-wider text-white/90 hover:text-white";

export default function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="bg-gradient-to-b from-black/35 via-black/20 to-transparent">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between py-3">
            {/* LEFT MENU */}
            <nav className="hidden items-center gap-7 md:flex">
              <NavLink to="/za-nas" className={menuLink}>ИНФОРМАЦИИ</NavLink>
              <NavLink to="/kontakt" className={menuLink}>УПИСИ</NavLink>
              <NavLink to="/kontakt" className={menuLink}>СТУДЕНТИ</NavLink>
            </nav>

            {/* BRAND */}
            <div className="mx-auto flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden">
                <img src={logo} alt="School logo" className="h-full w-full object-contain p-1" />
              </div>

              <div className="leading-tight text-white">
                <div className="text-base font-semibold">{school.name}</div>
                <div className="text-[11px] text-white/70">{school.website}</div>
              </div>
            </div>

            {/* RIGHT MENU */}
            <nav className="hidden items-center gap-7 md:flex">
              <NavLink to="/kontakt" className={menuLink}>СТИПЕНДИИ</NavLink>
              <NavLink to="/kontakt" className={menuLink}>ЛОКАЦИЈА</NavLink>
              <NavLink to="/kontakt" className={menuLink}>КОНТАКТ</NavLink>
            </nav>
          </div>
        </div>

        <div className="h-px bg-white/10" />
      </div>
    </header>
  );
}