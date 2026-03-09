import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import hero from "../assets/hero.png";
import { school } from "../data/school";

const ctas = [
  { label: "Онлајн Настава", to: "/kontakt" },
  { label: "Онлајн Тестови", to: "/kontakt" },
  { label: "ЧПП", to: "/kontakt" },
];

const onlineTracks = [
  { key: "komp", title: "Компјутерска техника", years: [1, 2, 3, 4] },
  { key: "mas", title: "Машински техничар", years: [1, 2, 3] },
  { key: "ener", title: "Енергетичар", years: [2] },
  { key: "elek", title: "Електроничар", years: [2] },
  { key: "arh", title: "Архитектонски техничар", years: [1, 2] },
  { key: "meh", title: "Мехатроника", years: [2] },
];

const events = [
  { day: "09", month: "DEC", title: "Отворен ден", note: "Посета за ученици и родители" },
  { day: "18", month: "DEC", title: "Натпревар по роботика", note: "Тимови од повеќе училишта" },
  { day: "26", month: "DEC", title: "Проектна недела", note: "Презентации и демонстрации" },
];

export default function OnlineNastavaSection() {
  const [trackKey, setTrackKey] = useState("komp");
  const [year, setYear] = useState(1);

  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");

  const activeTrack = useMemo(
    () => onlineTracks.find((t) => t.key === trackKey) || onlineTracks[0],
    [trackKey]
  );

  // ако смениш насока → намести првата валидна година
  useEffect(() => {
    if (!activeTrack.years.includes(year)) setYear(activeTrack.years[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackKey]);

  // LAZY LOAD: влечи само кога корисник ќе избере
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://192.168.0.28:3001/api/online?track=${trackKey}&year=${year}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Request failed");

        if (!cancelled) setSubjects(data.subjects || []);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [trackKey, year]);
  return (
    <div className="bg-slate-100">
      {/* HERO FULL WIDTH */}
      <section className="relative w-full overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero})` }}
        />

        {/* Poole-like overlay */}
        <div className="absolute inset-0 bg-slate-900/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 via-slate-900/55 to-slate-950/75" />

        {/* Arrows */}
        <button
          type="button"
          className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/25 p-3 text-white hover:bg-black/35 md:block"
          aria-label="Previous slide"
        >
          <span className="text-xl leading-none">‹</span>
        </button>
        <button
          type="button"
          className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/25 p-3 text-white hover:bg-black/35 md:block"
          aria-label="Next slide"
        >
          <span className="text-xl leading-none">›</span>
        </button>

        {/* Center hero text (pt-32 за да не се судри со Nav) */}
        <div className="relative z-10 flex min-h-[78vh] flex-col items-center justify-center px-6 pt-32 text-center text-white">
          <div className="text-2xl font-medium md:text-4xl">Welcome to</div>

          <h1 className="mt-2 text-5xl font-extrabold tracking-tight md:text-7xl">
            {school.name}
          </h1>

          <p className="mt-4 max-w-3xl text-sm text-white/85 md:text-base">
            Современо техничко образование со практична настава, проекти и стручни насоки.
          </p>

          {/* CTA bar */}
          <div className="mt-10 w-full max-w-6xl px-4">
            <div className="grid gap-3 md:grid-cols-3">
              {ctas.map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  className="rounded bg-slate-900/80 hover:bg-slate-900/90 px-6 py-4 text-center text-sm font-semibold text-white hover:bg-slate-900/80"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ONLINE NASTAVA */}
<section className="mx-auto max-w-6xl px-4 py-16">
  <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200 md:p-10">
    {/* Header */}
    <div className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
        🎓 Портал за ученици
      </div>
      <h2 className="mt-4 text-3xl font-extrabold text-[#0B2E5B] md:text-4xl">
        Онлајн Настава
      </h2>
      <p className="mt-3 text-base text-slate-600">
        Изберете насока и година
      </p>
    </div>

    {/* Track buttons */}
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xl font-bold text-slate-800">Насока</div>
        <div className="text-sm text-slate-500">Кликни за избор</div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {onlineTracks.map((t) => {
          const active = trackKey === t.key;

          const icon =
            t.key === "komp" ? "💻" :
            t.key === "mas" ? "⚙️" :
            t.key === "ener" ? "⚡" :
            t.key === "elek" ? "🔌" :
            t.key === "arh" ? "🏛️" :
            "🤖";

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTrackKey(t.key)}
              className={
                "group rounded-2xl border-2 p-5 text-left transition-all duration-200 " +
                "active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#0B2E5B]/15 " +
                (active
                  ? "border-[#0B2E5B] bg-[#0B2E5B] text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-800 hover:border-[#0B2E5B] hover:bg-slate-50 hover:shadow-sm")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={
                      "grid h-12 w-12 place-items-center rounded-xl text-2xl ring-1 transition " +
                      (active
                        ? "bg-white/10 ring-white/20"
                        : "bg-slate-100 ring-slate-200 group-hover:bg-slate-200")
                    }
                  >
                    {icon}
                  </div>
                  <div>
                    <div className="text-lg font-extrabold leading-tight">{t.title}</div>
                    <div className={active ? "mt-1 text-sm text-white/80" : "mt-1 text-sm text-slate-600"}>
                      Достапни години: {t.years.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>

    {/* Year buttons */}
    <div className="mt-10">
      <div className="mb-4 text-xl font-bold text-slate-800">Година</div>

      <div className="flex flex-wrap items-center gap-3">
        {activeTrack.years.map((y) => {
          const active = year === y;
          const label =
            y === 1 ? "I година" :
            y === 2 ? "II година" :
            y === 3 ? "III година" :
            "IV година";

          return (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={
                "rounded-xl border-2 px-6 py-3 text-lg font-bold transition-all duration-200 " +
                "active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-slate-900/10 " +
                (active
                  ? "border-slate-900 bg-slate-900 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-900 hover:bg-slate-50")
              }
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>

    {/* Subjects */}
    <div className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-2xl font-extrabold text-[#0B2E5B]">
          📚 Предмети
        </div>
        <div className="text-sm text-slate-500">
          {activeTrack.title} • {year}. година
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            <div className="text-sm font-semibold">Се вчитува…</div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <div className="text-sm font-semibold">Грешка: {error}</div>
        </div>
      )}

      {!loading && !error && subjects.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
          <div className="text-sm font-semibold">Нема материјали за избраното.</div>
        </div>
      )}

      {!loading && !error && subjects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {subjects.map((s) => (
            <button
              key={s.id}
              type="button"
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-[#0B2E5B] hover:bg-slate-50 hover:shadow-md active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#0B2E5B]/10"
              onClick={() => {
                // тука подоцна можеш да навигираш на предмет/материјали
                // пример: navigate(`/online/${trackKey}/${year}/${s.id}`)
                console.log("open subject", trackKey, year, s.id);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl ring-1 ring-slate-200 group-hover:bg-slate-200">
                    📄
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">
                      {s.title}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      Материјали • задачи • линкови
                    </div>
                  </div>
                </div>

                {s.lang && (
                  <span className="rounded-full bg-[#0B2E5B] px-3 py-1 text-xs font-bold text-white">
                    {s.lang.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="mt-4 text-sm font-semibold text-[#0B2E5B]">
                Отвори →
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
</section>
{/* ONLINE TESTOVI */}
<section className="mx-auto max-w-6xl px-4 py-16">
  <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200 md:p-10">
    
    {/* HEADER */}
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

    {/* CONTENT CARD */}
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
      {/* BELOW HERO — white themed content */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Center card */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-6">
            <div className="text-lg font-bold text-slate-900">
            <span className="font-normal text-slate-500">Добредојдовте</span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-700">
              ОСТУ „Гостивар“ е средно техничко училиште со повеќе стручни насоки. Учениците работат на проекти,
              лабораториски вежби и практична настава, со цел подобра подготовка за факултет или работа.
            </p>
          </div>

          {/* Right card */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-3">
            <div className="text-lg font-bold text-slate-900">
              Следни <span className="font-normal text-slate-500">Настани</span>
            </div>

            <div className="mt-4 space-y-3">
              {events.map((e) => (
                <div key={e.title} className="flex gap-3 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                  <div className="flex w-12 flex-col items-center justify-center rounded-md bg-[#0B2E5B] text-white">
                    <div className="text-sm font-bold">{e.day}</div>
                    <div className="text-[10px] font-semibold">{e.month}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{e.title}</div>
                    <div className="text-xs text-slate-600">{e.note}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-5 w-full rounded-md bg-[#0B2E5B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2750]">
              View all
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}