import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import bg from "../assets/hero.png";

export default function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  // Countdown redirect
  useEffect(() => {
    if (count <= 0) { navigate("/"); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  return (
    <div className="relative min-h-screen bg-slate-100 flex items-center justify-center px-4">

      {/* Background image */}
      <div className="absolute inset-0">
        <img src={bg} alt="" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-slate-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">

        {/* 404 big number */}
        <div
          className="text-[10rem] font-black leading-none text-white/10 select-none"
          style={{ textShadow: "0 0 80px rgba(255,255,255,0.05)" }}
        >
          404
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-8 shadow-2xl -mt-8">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-extrabold text-white mb-3">
            Страницата не е пронајдена
          </h1>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Страницата која ја барате не постои или е преместена.
            Ќе бидете вратени на почетната страница за{" "}
            <span className="font-bold text-white">{count}</span> секунди.
          </p>

          {/* Progress bar */}
          <div className="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-white/60 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(count / 10) * 100}%` }}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/")}
              className="rounded-xl bg-white text-slate-900 px-6 py-3 text-sm font-bold hover:bg-white/90 transition-colors"
            >
              🏠 Почетна страница
            </button>
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl border border-white/30 text-white px-6 py-3 text-sm font-bold hover:bg-white/10 transition-colors"
            >
              ← Назад
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}