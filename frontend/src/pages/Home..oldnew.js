import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import pic1 from "../assets/hero.png";
import pic2 from "../assets/slika.jpg"
import pic3 from "../assets/slika2.jpg";
import { school } from "../data/school";

// ─── Simple SVG icons ─────────────────────────────────────────────────────────

function OnlineIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="13" rx="2" className="fill-none stroke-current" strokeWidth="1.6" />
      <path d="M9 19h6" className="fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TestsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" className="fill-none stroke-current" strokeWidth="1.6" />
      <path d="M9 7h6M9 11h6M9 15h3" className="fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FaqIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 3.5c-3 0-5.5 2.4-5.5 5.4 0 1.7.7 3 1.9 4l.3.3c.4.4.6.8.7 1.3V16
           a1 1 0 0 0 1 1h3.2a1 1 0 0 0 1-1v-1.5c.1-.5.3-.9.7-1.3l.3-.3a5.2 5.2 0 0 0 1.9-4
           c0-3-2.5-5.4-5.5-5.4Z"
        className="fill-none stroke-current"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.8 18.2h4.4M10.4 20h3.2"
        className="fill-none stroke-current"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProgramsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="6" height="16" rx="1.4" className="fill-none stroke-current" strokeWidth="1.6" />
      <rect x="10" y="4" width="6" height="16" rx="1.4" className="fill-none stroke-current" strokeWidth="1.6" />
      <rect x="17" y="4" width="4" height="16" rx="1.4" className="fill-none stroke-current" strokeWidth="1.6" />
    </svg>
  );
}

function StudentsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 17.5c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5V20H4v-2.5Z"
        className="fill-none stroke-current"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="9" r="2.2" className="fill-none stroke-current" strokeWidth="1.6" />
      <path
        d="M12 18c.4-1.7 2-3 4-3s3.6 1.3 4 3"
        className="fill-none stroke-current"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="9" r="2.2" className="fill-none stroke-current" strokeWidth="1.6" />
    </svg>
  );
}

function TeachersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="4" y="4" width="16" height="12" rx="1.6" className="fill-none stroke-current" strokeWidth="1.6" />
      <path d="M7 9h6M7 12h4" className="fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 20h4" className="fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" className="fill-none stroke-current" strokeWidth="1.6" />
      <path d="M8 3v4M16 3v4M4 9h16" className="fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="8" y="12" width="3" height="3" rx="0.6" className="fill-current" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ctas = [
  { label: "Онлајн Настава", href: "#online", Icon: OnlineIcon },
  { label: "Онлајн Тестови", href: "#tests",  Icon: TestsIcon },
  { label: "ЧПП",            href: "#faq",    Icon: FaqIcon },
];

const onlineTracks = [
  { key: "komp", title: "Компјутерска техника",   years: [1, 2, 3, 4] },
  { key: "mas",  title: "Машински техничар",       years: [1, 2, 3] },
  { key: "ener", title: "Енергетичар",             years: [2] },
  { key: "elek", title: "Електроничар",            years: [2] },
  { key: "arh",  title: "Архитектонски техничар",  years: [1, 2] },
  { key: "meh",  title: "Мехатроника",             years: [2] },
];

const stats = [
  { value: "6",    label: "Стручни насоки",  Icon: ProgramsIcon },
  { value: "500+", label: "Активни ученици", Icon: StudentsIcon },
  { value: "20+",  label: "Наставници",      Icon: TeachersIcon },
  { value: "1999", label: "Основано",        Icon: CalendarIcon },
];

// ─── useInView hook ────────────────────────────────────────────────────────────

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

// ─── Reveal wrapper ───────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();
  const from = {
    up:    "translateY(40px)",
    left:  "translateX(-40px)",
    right: "translateX(40px)",
  }[direction] ?? "translateY(40px)";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? "translate(0)" : from,
        transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [trackKey, setTrackKey] = useState("komp");
  const [year,     setYear]     = useState(1);
  const [loading,  setLoading]  = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [error,    setError]    = useState("");
  const [heroFull, setHeroFull] = useState(true);

  const activeTrack = useMemo(
    () => onlineTracks.find((t) => t.key === trackKey) ?? onlineTracks[0],
    [trackKey]
  );

  // Hero shrinks after first scroll
  useEffect(() => {
    const onScroll = () => setHeroFull(window.scrollY < 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset year when track changes
  useEffect(() => {
    if (!activeTrack.years.includes(year)) setYear(activeTrack.years[0]);
  }, [trackKey]); // eslint-disable-line

  // Fetch subjects
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError("");
      try {
        const res  = await fetch(`https://ostu-site-backend.vercel.app/api/online?track=${trackKey}&year=${year}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Request failed");
        if (!cancelled) setSubjects(data.subjects ?? []);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [trackKey, year]);

  const trackIcon = (key) =>
    ({ komp: "💻", mas: "⚙️", ener: "⚡", elek: "🔌", arh: "🏛️" }[key] ?? "🤖");

  return (
    <div className="bg-slate-100 overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden transition-[min-height] duration-700 ease-in-out"
        style={{ minHeight: heroFull ? "100vh" : "78vh" }}
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${pic1})` }} />
        <div className="absolute inset-0 bg-slate-900/65" />

        {/* Arrows */}
        <button type="button" aria-label="Previous"
          className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/25 p-3 text-white hover:bg-black/45 transition md:block">
          <span className="text-xl leading-none">‹</span>
        </button>
        <button type="button" aria-label="Next"
          className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/25 p-3 text-white hover:bg-black/45 transition md:block">
          <span className="text-xl leading-none">›</span>
        </button>

        {/* Content */}
        <div className="relative z-10 flex min-h-[inherit] flex-col items-center justify-center px-6 pt-28 text-center text-white">
          <p className="text-xl font-medium text-white/80 md:text-3xl" style={{ animation: "fadeUp 0.6s 0.2s ease both" }}>
            Добредојдовте во
          </p>
          <h1 className="mt-2 text-5xl font-extrabold tracking-tight md:text-7xl" style={{ animation: "fadeUp 0.6s 0.4s ease both" }}>
            {school.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/75 md:text-base" style={{ animation: "fadeUp 0.6s 0.6s ease both" }}>
            Современо техничко образование со практична настава, проекти и стручни насоки.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 w-full max-w-3xl px-4">
            <div className="grid gap-3 md:grid-cols-3">
              {ctas.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 px-6 py-4 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] will-change-transform"
                >
                  {Icon && <Icon className="h-5 w-5 text-white" />}
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500 pointer-events-none"
            style={{ opacity: heroFull ? 0.55 : 0 }}>
            <span className="text-white/60 text-[11px] tracking-widest uppercase">Скрол надолу</span>
            <div className="w-px h-8 bg-white/40 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── SECTION 1: Text Left / Image Right ───────────────────────────────── */}
      <section className="flex flex-col md:flex-row min-h-[600px]">
        <Reveal direction="left" className="w-full md:w-[40%] flex flex-col justify-center px-10 py-16 md:px-16 bg-slate-50">
          <h2 className="text-4xl font-black text-slate-900 mb-3">За Нас</h2>
          <p className="text-slate-500 text-base mb-6">
            Средно техничко училиште со повеќе стручни насоки, модерна опрема и посветени наставници.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            ОСТУ „Гостивар" е едно од водечките технички училишта во регионот. Учениците работат на реални
            проекти и практична настава со цел подобра подготовка за факултет или работа.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Со современа инфраструктура и стручен кадар, нудиме образование кое ги следи светските стандарди
            во техничката и технолошката областа.
          </p>
        </Reveal>

        <div className="w-full md:w-[60%] relative overflow-hidden min-h-[340px]">
          <Reveal direction="right" className="absolute inset-0">
            <img src={pic3} alt="Училиште" className="w-full h-full object-cover" />
          </Reveal>
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <section className="bg-slate-700 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map(({ value, label, Icon }, i) => (
            <Reveal key={label} delay={i * 0.1}>
              <div className="mb-2 flex justify-center">
                <Icon className="h-7 w-7 text-white/90" />
              </div>
              <div className="text-4xl font-black text-white">{value}</div>
              <div className="mt-1 text-sm text-blue-200 font-medium">{label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: Image Left / Text Right ───────────────────────────────── */}
      <section className="flex flex-col md:flex-row min-h-[600px]">
        <div className="w-full md:w-[60%] relative overflow-hidden min-h-[340px]">
          <Reveal direction="left" className="absolute inset-0">
            <img src={pic2} alt="Настава" className="w-full h-full object-cover" />
          </Reveal>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-slate-50 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
        </div>

        <Reveal direction="right" className="w-full md:w-[40%] flex flex-col justify-center px-10 py-16 md:px-16 bg-slate-50">
          <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-3">Стручна Подготовка</span>
          <h2 className="text-4xl font-black text-slate-900 mb-3 leading-tight">
            Практична<br />Настава
          </h2>
          <div className="w-12 h-1 bg-slate-700 rounded-full mb-5" />
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Секоја насока нуди практична работа во специјализирани лаборатории и работилници,
            каде учениците стекнуваат вештини директно применливи во индустријата.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            Соработуваме со локални компании за{" "}
            <Link to="/praktika" className="text-slate-400 hover:underline font-medium">практика и стажирање</Link>
            {" "}— отвораме врати кон вистинскиот свет на трудот уште за време на школувањето.
          </p>
          <div>
            <Link to="/informacii"
              className="inline-flex items-center gap-2 bg-[#0B2E5B] hover:bg-[#0a2750] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:gap-3">
              Дознај повеќе <span>→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── ONLINE TESTOVI ───────────────────────────────────────────────────── */}
      <section id="tests" className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200 md:p-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
              📝 Активности
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-[#0B2E5B] md:text-4xl">
              Онлајн Тестови
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Следете ги најавените тестирања и рокови
            </p>
          </div>
          <div className="mt-10">
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <div className="text-5xl">📭</div>
              <div className="mt-4 text-xl font-bold text-slate-800">
                За сега не се најавени тестови
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Кога ќе бидат објавени нови тестови, ќе се прикажат тука.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ОНЛАЈН НАСТАВА ───────────────────────────────────────────────────── */}
      <section id="online" className="px-3 py-12 md:px-4 md:py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-200 sm:p-8 md:p-10">

              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 sm:px-4 sm:py-2 sm:text-sm">
                  🎓 Портал за ученици
                </div>
                <h2 className="mt-3 text-2xl font-extrabold text-[#0B2E5B] sm:mt-4 sm:text-3xl md:text-4xl">
                  Онлајн Настава
                </h2>
                <p className="mt-2 text-sm text-slate-600 sm:mt-3 sm:text-base">
                  Изберете насока и година
                </p>
                <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  1. Насока • 2. Година • 3. Предмет
                </p>
              </div>

              {/* Tracks */}
              <div className="mt-8 md:mt-10">
                <div className="mb-3 flex items-center justify-between md:mb-4">
                  <div className="text-lg font-bold text-slate-800 md:text-xl">Насока</div>
                  <div className="text-xs text-slate-500 sm:text-sm">Кликни за избор</div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {onlineTracks.map((t) => {
                    const active = trackKey === t.key;
                    return (
                      <button key={t.key} type="button" onClick={() => setTrackKey(t.key)}
                        className={
                          "group rounded-xl border-2 p-4 text-left transition-all duration-200 " +
                          "active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#0B2E5B]/15 " +
                          (active
                            ? "border-[#0B2E5B] bg-[#0B2E5B] text-white shadow-md"
                            : "border-slate-200 bg-white text-slate-800 hover:border-[#0B2E5B] hover:bg-slate-50 hover:shadow-sm")
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className={
                            "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl ring-1 transition " +
                            (active ? "bg-white/10 ring-white/20" : "bg-slate-100 ring-slate-200 group-hover:bg-slate-200")
                          }>
                            {trackIcon(t.key)}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-base font-extrabold leading-tight">{t.title}</div>
                            <div className={active ? "mt-0.5 text-xs text-white/80" : "mt-0.5 text-xs text-slate-500"}>
                              Години: {t.years.join(", ")}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Years */}
              <div className="mt-8 md:mt-10">
                <div className="mb-3 text-lg font-bold text-slate-800 md:mb-4 md:text-xl">Година</div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                  {activeTrack.years.map((y) => {
                    const active = year === y;
                    return (
                      <button key={y} type="button" onClick={() => setYear(y)}
                        className={
                          "rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all duration-200 " +
                          "active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-slate-900/10 " +
                          (active
                            ? "border-slate-900 bg-slate-900 text-white shadow-md"
                            : "border-slate-200 bg-white text-slate-800 hover:border-slate-900 hover:bg-slate-50")
                        }
                      >
                        {["I", "II", "III", "IV"][y - 1]} година
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subjects */}
              <div className="mt-10 md:mt-12">
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between md:mb-5">
                  <div className="text-xl font-extrabold text-[#0B2E5B] md:text-2xl">📚 Предмети</div>
                  <div className="text-xs text-slate-500 sm:text-sm">{activeTrack.title} • {year}. година</div>
                </div>

                {loading && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                      <span className="text-sm font-semibold">Се вчитува…</span>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                    <span className="text-sm font-semibold">Грешка: {error}</span>
                  </div>
                )}
                {!loading && !error && subjects.length === 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
                    <span className="text-sm font-semibold">Нема материјали за избраното.</span>
                  </div>
                )}
                {!loading && !error && subjects.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    {subjects.map((s) => (
                      <button key={s.id} type="button"
                        onClick={() => console.log("open subject", trackKey, year, s.id)}
                        className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-[#0B2E5B] hover:shadow-md active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#0B2E5B]/10 sm:p-6"
                      >
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-lg ring-1 ring-slate-200 group-hover:bg-slate-200 transition sm:h-11 sm:w-11 sm:text-xl">
                              📄
                            </div>
                            <div>
                              <div className="text-base font-extrabold text-slate-900 sm:text-lg">{s.title}</div>
                              <div className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">Материјали • задачи • линкови</div>
                            </div>
                          </div>
                          {s.lang && (
                            <span className="shrink-0 rounded-full bg-[#0B2E5B] px-2 py-0.5 text-xs font-bold text-white sm:px-3 sm:py-1">
                              {s.lang.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs sm:text-sm">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                            Предмет
                          </span>
                          <span className="font-semibold text-[#0B2E5B] group-hover:translate-x-1 transition-transform">
                            Отвори →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Keyframes for hero entrance */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}
