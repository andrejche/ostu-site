import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bg from "../assets/hero.png";
const API_URL = process.env.REACT_APP_API_URL;

const API = `${API_URL}/api/news`;

if (!API_URL) {
  console.error("API URL missing!");
}

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity:   inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
    }}>
      {children}
    </div>
  );
}

export default function NewsArticle() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { t, i18n } = useTranslation();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadArticle() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Request failed");
        if (!cancelled) setArticle(data);
      } catch {
        if (!cancelled) setError(t("newsArticle.error"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadArticle();
    return () => {
      cancelled = true;
    };
  }, [id, t]);

  const date = article
    ? new Date(article.createdAt).toLocaleDateString(i18n.language === "mk" ? "mk-MK" : i18n.language === "sq" ? "sq-AL" : i18n.language === "tr" ? "tr-TR" : "en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "";

  return (
    <div className="relative bg-slate-100">

      {/* ── IMAGE ── */}
      <div className="absolute inset-x-0 top-0 h-[60vh]">
        <img
          src={article?.image || bg}
          alt=""
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-slate-100" />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative mx-auto max-w-4xl px-4 pt-40 pb-24">

        {/* Back button */}
        <Reveal delay={0}>
          <button
            onClick={() => navigate("/vesti")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            ← {t("newsArticle.back")}
          </button>
        </Reveal>

        {loading && (
          <div className="flex items-center gap-3 p-8 text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#0B2E5B]" />
            <span className="text-sm font-semibold">{t("newsArticle.loading")}</span>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        {article && (
          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-8 shadow-xl shadow-slate-200/60">

              {article.category && (
                <span className="inline-block mb-4 rounded-full bg-[#0B2E5B]/10 px-3 py-1 text-xs font-semibold text-[#0B2E5B] uppercase tracking-wider">
                  {article.category}
                </span>
              )}

              <h1 className="text-3xl font-extrabold text-slate-900 mb-3 leading-tight md:text-4xl">
                {article.title}
              </h1>

              <div className="flex items-center gap-2 mb-8 text-sm text-slate-400">
                <span>📅</span>
                <span>{date}</span>
              </div>

              <div className="w-16 h-1 bg-[#0B2E5B]/20 rounded-full mb-8" />

              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {article.body}
              </div>

            </div>
          </Reveal>
        )}

      </div>
    </div>
  );
}