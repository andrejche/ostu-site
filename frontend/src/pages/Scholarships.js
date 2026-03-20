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

export default function Scholarships() {
  const { t } = useTranslation();

  const supportItems = [
    { icon: "📢", label: t("scholarships.step1Title"), desc: t("scholarships.step1Desc") },
    { icon: "🔗", label: t("scholarships.step2Title"), desc: t("scholarships.step2Desc") },
    { icon: "🏫", label: t("scholarships.step3Title"), desc: t("scholarships.step3Desc") },
  ];

  return (
    <div className="relative bg-slate-100">

      {/* IMAGE */}
      <div className="absolute inset-x-0 top-0 h-[60vh]">
        <img src={bg} alt="" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-slate-100" />
      </div>

      {/* CONTENT */}
      <div className="relative mx-auto max-w-6xl px-4 pt-40 pb-24">

        {/* Intro */}
        <Reveal direction="up" delay={0.05}>
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-8 shadow-xl shadow-slate-200/60">
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">🏅</div>
              <h1 className="text-3xl font-extrabold text-slate-900">{t("scholarships.title")}</h1>
            </div>
            <p className="text-slate-600 leading-relaxed">{t("scholarships.intro")}</p>
          </div>
        </Reveal>

        {/* State scholarships */}
        <div className="mt-6">
          <Reveal direction="up" delay={0.1}>
            <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-6 shadow-xl shadow-slate-200/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">🎓</div>
                <h2 className="text-lg font-bold text-slate-900">{t("scholarships.stateTitle")}</h2>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{t("scholarships.stateDesc")}</p>
            </div>
          </Reveal>
        </div>

        {/* Process */}
        <div className="mt-8">
          <Reveal direction="up" delay={0.05}>
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">🤝</div>
              <h2 className="text-2xl font-bold text-slate-900">{t("scholarships.processTitle")}</h2>
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3">
            {supportItems.map((item, i) => (
              <Reveal key={item.label} direction="up" delay={i * 0.1}>
                <div className="group rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-6 shadow-xl shadow-slate-200/60 hover:bg-white/90 transition-all duration-300 hover:scale-[1.02]">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#0B2E5B]/10 text-2xl mb-4 group-hover:bg-[#0B2E5B]/20 transition-colors">
                    {item.icon}
                  </div>
                  <div className="font-bold text-slate-900 mb-2">{item.label}</div>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}