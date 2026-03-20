import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import bg from "../assets/hero.png";

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

export default function About() {
  const { t } = useTranslation();

  const infoItems = [
    [t("infoItems.address"),        "Илинденска 167, Гостивар"],
    [t("infoItems.name"),           "ОСТУ 'Гостивар' - Гостивар"],
    [t("infoItems.phone"),          "042-214-333"],
    [t("infoItems.email"),          "ostugostivar@yahoo.com"],
    [t("infoItems.built"),          "1963 / 1975"],
    [t("infoItems.construction"),   t("infoItems.constructionVal")],
    [t("infoItems.sportsArea"),     "2200 м²"],
    [t("infoItems.verification"),   "Акт бр.5233 од НО на општина Гостивар"],
    [t("infoItems.verificationYear"),"12.09.1960 / 01.09.1978"],
    [t("infoItems.language"),       t("infoItems.languageVal")],
    [t("infoItems.buildingArea"),   "3461 м²"],
    [t("infoItems.yardArea"),       "13054 м²"],
    [t("infoItems.shifts"),         t("infoItems.shiftsVal")],
    [t("infoItems.heating"),        t("infoItems.heatingVal")],
    [t("infoItems.classes"),        "48"],
  ];

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

        {/* HISTORY */}
        <Reveal direction="up" delay={0.05}>
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-8 shadow-xl shadow-slate-200/60">
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">📜</div>
              <h2 className="text-2xl font-bold text-slate-900">{t("about.historyTitle")}</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">{t("about.historyP1")}</p>
            <p className="text-slate-600 leading-relaxed mb-4">{t("about.historyP2")}</p>
            <p className="text-slate-600 leading-relaxed">{t("about.historyP3")}</p>
          </div>
        </Reveal>

        {/* SCHOOL INFO */}
        <div className="mt-8">
          <Reveal direction="up" delay={0.05}>
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">🏫</div>
              <h2 className="text-2xl font-bold text-slate-900">{t("about.cardTitle")}</h2>
            </div>
          </Reveal>

          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/60 overflow-hidden">
            <div className="grid md:grid-cols-2">
              {infoItems.map(([title, value], i) => (
                <Reveal key={title} direction="up" delay={i * 0.03}>
                  <div className="border-b border-slate-100/80 p-5 flex flex-col hover:bg-white/60 transition-colors duration-200">
                    <span className="text-xs font-semibold text-[#0B2E5B]/60 uppercase tracking-wider">
                      {title}
                    </span>
                    <span className="text-slate-800 font-medium mt-1">
                      {value}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}