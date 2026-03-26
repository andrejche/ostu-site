import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bg from "../assets/hero.png";

const API = "https://ostu-site.onrender.com/api/news";

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

function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();
  const from = { up: "translateY(40px)", left: "translateX(-40px)", right: "translateX(40px)" }[direction] ?? "translateY(40px)";
  return (
    <div ref={ref} className={className} style={{
      opacity:   inView ? 1 : 0,
      transform: inView ? "translate(0)" : from,
      transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
    }}>
      {children}
    </div>
  );
}

function NewsCard({ article, index, onClick }) {
  const { t, i18n } = useTranslation();

  const date = new Date(article.createdAt).toLocaleDateString(
    i18n.language === "mk" ? "mk-MK" :
    i18n.language === "sq" ? "sq-AL" :
    i18n.language === "tr" ? "tr-TR" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <Reveal direction="up" delay={index * 0.08}>
      <div
        onClick={() => onClick(article._id)}
        className="group cursor-pointer rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/60 overflow-hidden hover:bg-white/90 hover:scale-[1.01] transition-all duration-300"
      >
        {article.image && (
          <div className="h-48 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="p-6">
          {article.category && (
            <span className="inline-block mb-3 rounded-full bg-[#0B2E5B]/10 px-3 py-1 text-xs font-semibold text-[#0B2E5B] uppercase tracking-wider">
              {article.category}
            </span>
          )}

          <h2 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-[#0B2E5B] transition-colors leading-snug">
            {article.title}
          </h2>

          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">
            {article.excerpt || article.body?.substring(0, 150) + "..."}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{date}</span>
            <span className="text-xs font-semibold text-[#0B2E5B] group-hover:translate-x-1 transition-transform">
              {t("news.readMore")} →
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function News() {
  const { t }                       = useTranslation();
  const [articles, setArticles]     = useState([]);
  const [loading,  setLoading]      = useState(true);
  const [error,    setError]        = useState("");
  const navigate                    = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function loadNews() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Request failed");
        if (!cancelled) setArticles(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError(t("news.error"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadNews();
    return () => {
      cancelled = true;
    };
  }, [t]);

  return (
    <div className="relative bg-slate-100">

      {/* ── IMAGE ── */}
      <div className="absolute inset-x-0 top-0 h-[60vh]">
        <img src={bg} alt="" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-slate-100" />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative mx-auto max-w-6xl px-4 pt-40 pb-24">

        {/* Header */}
        <Reveal direction="up" delay={0.05}>
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-8 shadow-xl shadow-slate-200/60 mb-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">📰</div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">{t("news.title")}</h1>
                <p className="text-slate-500 text-sm mt-0.5">{t("news.subtitle")}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 p-8 text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#0B2E5B]" />
            <span className="text-sm font-semibold">{t("news.loading")}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && articles.length === 0 && (
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-12 text-center shadow-xl">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-lg font-bold text-slate-800">{t("news.empty")}</div>
            <div className="text-sm text-slate-500 mt-2">{t("news.emptyNote")}</div>
          </div>
        )}

        {/* News grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <NewsCard
                key={article._id}
                article={article}
                index={i}
                onClick={(id) => navigate(`/vesti/${id}`)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}