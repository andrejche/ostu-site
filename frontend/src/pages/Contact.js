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

const socials = [
  { label: "Facebook",  icon: "📘", url: "https://www.facebook.com/groups/635775916502556/" },
  { label: "Instagram", icon: "📷", url: "https://www.instagram.com/ostu_gostivar/" },
  { label: "YouTube",   icon: "📺", url: "https://www.youtube.com/@PB-lm8qr/videos" },
];

export default function Contact() {
  const { t } = useTranslation();
  const [form,   setForm]   = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  const contactInfo = [
    { icon: "📍", label: t("contact.address"),     value: "Илинденска 167, Гостивар" },
    { icon: "📞", label: t("contact.phone"),        value: "042-214-333" },
    { icon: "📧", label: t("contact.email"),        value: "ostugostivar@yahoo.com" },
    { icon: "🕐", label: t("contact.workingHours"), value: t("contact.workingHoursVal") },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("sent");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

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
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">📬</div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">{t("contact.title")}</h1>
                <p className="text-slate-500 text-sm mt-0.5">{t("contact.subtitle")}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Contact info + Form */}
        <div className="grid gap-6 lg:grid-cols-5">

          {/* ── LEFT ── */}
          <Reveal direction="left" delay={0.1} className="lg:col-span-2">
            <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-6 shadow-xl shadow-slate-200/60 h-full">
              <h2 className="text-lg font-bold text-slate-900 mb-5">{t("contact.infoTitle")}</h2>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0B2E5B]/10 text-base">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</div>
                      <div className="text-slate-800 font-medium text-sm mt-0.5">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-6 h-px bg-slate-100" />

              <h2 className="text-sm font-bold text-slate-900 mb-3">{t("contact.followUs")}</h2>
              <div className="flex gap-2 flex-wrap">
                {socials.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-[#0B2E5B] hover:text-[#0B2E5B] transition-colors">
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── RIGHT: Form ── */}
          <Reveal direction="right" delay={0.1} className="lg:col-span-3">
            <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-6 shadow-xl shadow-slate-200/60">
              <h2 className="text-lg font-bold text-slate-900 mb-5">{t("contact.formTitle")}</h2>

              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <div className="text-lg font-bold text-slate-800">{t("contact.sent")}</div>
                  <div className="text-sm text-slate-500 mt-2 mb-6">{t("contact.sentNote")}</div>
                  <button onClick={() => setStatus("")}
                    className="rounded-xl bg-[#0B2E5B] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0a2750] transition-colors">
                    {t("contact.sendAnother")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("contact.nameLabel")}</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t("contact.namePlaceholder")}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E5B]/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("contact.emailLabel")}</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E5B]/20" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("contact.subjectLabel")}</label>
                    <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={t("contact.subjectPlaceholder")}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E5B]/20" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("contact.messageLabel")}</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t("contact.messagePlaceholder")}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E5B]/20 resize-none" />
                  </div>

                  <button type="submit" disabled={status === "sending"}
                    className="w-full rounded-xl bg-[#0B2E5B] hover:bg-[#0a2750] disabled:opacity-60 px-6 py-3 text-sm font-bold text-white transition-colors">
                    {status === "sending" ? t("contact.sending") : t("contact.submit")}
                  </button>
                </form>
              )}
            </div>
          </Reveal>

        </div>

        {/* ── MAP ── */}
        <Reveal direction="up" delay={0.1} className="mt-8">
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/60 overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-slate-100">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0B2E5B]/10 text-base">🗺️</div>
              <div>
                <div className="font-bold text-slate-900">{t("contact.location")}</div>
                <div className="text-xs text-slate-500">Илинденска 167, Гостивар</div>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <iframe
                title="ОСТУ Гостивар локација"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2967.5!2d20.9027!3d41.7961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDQ3JzQ2LjAiTiAyMMKwNTQnMDkuNyJF!5e0!3m2!1sen!2smk!4v1234567890"
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}