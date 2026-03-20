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

const tools = [
  { icon: "🖥️", name: "Visual Studio Code" },
  { icon: "🐙", name: "Git & GitHub" },
  { icon: "🐍", name: "Python" },
  { icon: "⚡", name: "JavaScript" },
  { icon: "🗄️", name: "SQL" },
  { icon: "🌐", name: "HTML & CSS" },
  { icon: "☕", name: "Java" },
  { icon: "🔷", name: "C++" },
];

export default function PrakticnaNastava() {
  const { t } = useTranslation();

  const activities = [
    { icon: "💻", title: t("praktika.act1Title"), desc: t("praktika.act1Desc") },
    { icon: "🐛", title: t("praktika.act2Title"), desc: t("praktika.act2Desc") },
    { icon: "🏗️", title: t("praktika.act3Title"), desc: t("praktika.act3Desc") },
    { icon: "🤝", title: t("praktika.act4Title"), desc: t("praktika.act4Desc") },
    { icon: "🔍", title: t("praktika.act5Title"), desc: t("praktika.act5Desc") },
    { icon: "🚀", title: t("praktika.act6Title"), desc: t("praktika.act6Desc") },
  ];

  const whyItems = [
    { icon: "💼", title: t("praktika.why1Title"), desc: t("praktika.why1Desc") },
    { icon: "🧠", title: t("praktika.why2Title"), desc: t("praktika.why2Desc") },
    { icon: "🌍", title: t("praktika.why3Title"), desc: t("praktika.why3Desc") },
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

        {/* Header */}
        <Reveal direction="up" delay={0.05}>
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-8 shadow-xl shadow-slate-200/60 mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">🎯</div>
              <h1 className="text-3xl font-extrabold text-slate-900">{t("praktika.title")}</h1>
            </div>
            <p className="text-slate-600 leading-relaxed">{t("praktika.intro")}</p>
          </div>
        </Reveal>

        {/* What we do */}
        <Reveal direction="up" delay={0.05}>
          <div className="flex items-center gap-3 mb-6">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">⚡</div>
            <h2 className="text-2xl font-bold text-slate-900">{t("praktika.activitiesTitle")}</h2>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
          {activities.map((a, i) => (
            <Reveal key={a.title} direction="up" delay={i * 0.07}>
              <div className="group rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-6 shadow-xl shadow-slate-200/60 hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 h-full">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#0B2E5B]/10 text-2xl mb-4 group-hover:bg-[#0B2E5B]/20 transition-colors">
                  {a.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{a.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{a.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Tools */}
        <Reveal direction="up" delay={0.05}>
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-8 shadow-xl shadow-slate-200/60 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">🛠️</div>
              <h2 className="text-2xl font-bold text-slate-900">{t("praktika.toolsTitle")}</h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">{t("praktika.toolsDesc")}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tools.map((tool) => (
                <div key={tool.name}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-[#0B2E5B]/30 hover:bg-slate-50 transition-colors">
                  <span className="text-xl">{tool.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Why it matters */}
        <Reveal direction="up" delay={0.05}>
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-8 shadow-xl shadow-slate-200/60">
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">🎓</div>
              <h2 className="text-2xl font-bold text-slate-900">{t("praktika.whyTitle")}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {whyItems.map((item) => (
                <div key={item.title} className="rounded-xl bg-[#0B2E5B]/5 border border-[#0B2E5B]/10 p-5">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div className="font-bold text-slate-900 mb-2">{item.title}</div>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}