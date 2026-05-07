import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import bg from "../assets/hero.png";

const API_URL = process.env.REACT_APP_API_URL;
const API = `${API_URL}/api/teachers`;

function useInView(threshold = 0.1) {
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
  const from = {
    up:    "translateY(40px)",
    left:  "translateX(-40px)",
    right: "translateX(40px)",
  }[direction] ?? "translateY(40px)";
  return (
    <div ref={ref} className={className} style={{
      opacity:    inView ? 1 : 0,
      transform:  inView ? "translate(0)" : from,
      transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
    }}>
      {children}
    </div>
  );
}

function TeacherCard({ teacher, index }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const initials = teacher.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const subjectCount = teacher.subjects?.length || 0;

  return (
    <Reveal direction="up" delay={(index % 3) * 0.08}>
      <div
        className="group rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/60 p-5 hover:bg-white/90 transition-all duration-300 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-4">

          {teacher.image ? (
            <img
              src={teacher.image}
              alt={teacher.name}
              className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-md"
            />
          ) : (
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#0B2E5B] text-white font-extrabold text-lg shadow-md">
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-slate-900 dark:text-white leading-tight truncate group-hover:text-[#0B2E5B] dark:group-hover:text-blue-400 transition-colors">
              {teacher.name}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {subjectCount} {subjectCount === 1 ? t("teachers.subject") : t("teachers.subjects")}
            </div>
          </div>

          <div className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
            ▾
          </div>
        </div>

        {expanded && teacher.subjects?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2">
            {teacher.subjects.map((s) => (
              <span key={s} className="rounded-full bg-[#0B2E5B]/10 dark:bg-blue-400/10 border border-[#0B2E5B]/15 dark:border-blue-400/20 px-3 py-1 text-xs font-medium text-[#0B2E5B] dark:text-blue-400">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default function Teachers() {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data) => { setTeachers(data); setFiltered(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      teachers.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.subjects?.some((s) => s.toLowerCase().includes(q))
      )
    );
  }, [search, teachers]);

  return (
    <div className="relative bg-slate-100 dark:bg-slate-900">

      {/* IMAGE */}
      <div className="absolute inset-x-0 top-0 h-[60vh]">
        <img src={bg} alt="" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-slate-100 dark:to-slate-900" />
      </div>

      {/* CONTENT */}
      <div className="relative mx-auto max-w-6xl px-4 pt-40 pb-24">

        {/* Header */}
        <Reveal direction="up" delay={0.05}>
          <div className="rounded-2xl border border-white/30 dark:border-slate-700/30 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-8 shadow-xl shadow-slate-200/60 dark:shadow-none mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">👩‍🏫</div>
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t("teachers.title")}</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                    {loading ? t("teachers.loading") : `${teachers.length} ${t("teachers.title").toLowerCase()}`}
                  </p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("teachers.searchPlaceholder")}
                  className="w-full sm:w-72 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 pl-9 pr-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0B2E5B]/20"
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 p-8 text-slate-500 dark:text-slate-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#0B2E5B]" />
            <span className="text-sm font-semibold">{t("teachers.loading")}</span>
          </div>
        )}

        {/* No results */}
        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-white/30 dark:border-slate-700/30 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-12 text-center shadow-xl dark:shadow-none">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-lg font-bold text-slate-800 dark:text-white">{t("teachers.noResults")}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t("teachers.noResultsNote")}</div>
          </div>
        )}

        {/* Teachers grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((teacher, i) => (
              <TeacherCard key={teacher.name} teacher={teacher} index={i} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}