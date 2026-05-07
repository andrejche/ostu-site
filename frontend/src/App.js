import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Nav from "./components/Nav";
import ChatWidget from "./components/ChatWidget";
import "./i18n";
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Students from "./pages/Students";
import News from "./pages/News";
import Scholarships from "./pages/Scholarships";
import Contact from "./pages/Contact";
import Teachers from "./pages/Teachers";
import NewsArticle from "./pages/NewsArticle";
import AdminPanel from "./pages/AdminPanel";
import Nastava from "./pages/Coding";
import Folders from "./pages/Folders";
import NotFound from "./pages/NotFound";

// ─── Scroll to top on every route change ──────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen text-slate-100 overflow-x-hidden dark:bg-slate-900">
      <ScrollToTop />
      {!pathname.startsWith("/admin") && <Nav />}
      <main>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/za-nas"       element={<About />} />
          <Route path="/nasoki"       element={<Programs />} />
          <Route path="/studenti"     element={<Students />} />
          <Route path="/stipendii"    element={<Scholarships />} />
          <Route path="/kontakt"      element={<Contact />} />
          <Route path="/vesti"        element={<News />} />
          <Route path="/profesori" element={<Teachers />} />
          <Route path="/nastava" element={<Nastava />} />
           <Route path="/Folders" element={<Folders />} />
          <Route path="/vesti/:id"    element={<NewsArticle />} />
          <Route path="/admin"         element={<AdminPanel />} />
          <Route path="/admin/vesti"   element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <ChatWidget />
      {!pathname.startsWith("/admin") && (
      <footer className="border-t border-white/10 dark:border-slate-700/50 bg-white/10 dark:bg-slate-800/50">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold text-slate-400 dark:text-slate-300">ОСТУ „Гостивар"</div>
            <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Ул. Илинденска 167, Гостивар • Тел: 042 / 111 – 222 | Направено од Андреј Танески
            </div>
          </div>
          <nav className="flex flex-wrap gap-3 text-xs md:text-sm">
            {/* <Link to="/vesti"    className="hover:text-slate-200 transition-colors">Вести</Link>
            <Link to="/kontakt"  className="hover:text-slate-200 transition-colors">{t("nav.contact",    "Контакт")}</Link> */}
          </nav>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} ОСТУ „Гостивар" • {t("footer.rights", "Сите права задржани")}
          </span>
        </div>
      </footer>
      )}
    </div>
  );
}