import bg from "../assets/hero.png";

export default function Students() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-[center_top]"
        style={{ backgroundImage: `url(${bg})` }}
      />

      {/* Dark + blur overlay */}
      <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-24 text-slate-200">

        <h1 className="text-4xl font-extrabold text-white mb-6">
          За ученици
        </h1>

        <p className="max-w-3xl text-slate-300 leading-relaxed">
          Оваа страница содржи најважни информации за активни ученици:
          распоред, настани, онлајн ресурси и поддршка за учење.
        </p>

        {/* Top sections */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">

          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-3">
              📅 Распоред и активности
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Распоредот на часови, дополнителна настава и воннаставни активности
              ќе биде достапен преку онлајн календар. За сите промени и најави
              ќе бидете известени преку одделенските раководители и веб страната.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-3">
              💻 Онлајн ресурси
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Материјалите по предмети, домашни задачи и линкови до онлајн тестови
              ги наоѓате во делот „Онлајн настава“. Редовно следете ги
              објавените ресурси и рокови.
            </p>
          </div>

        </div>

        {/* Additional cards */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            Поддршка и правила
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[
              { icon: "📘", label: "Правила за однесување" },
              { icon: "🎓", label: "Поддршка при учење" },
              { icon: "🧭", label: "Професионална ориентација" },
            ].map((item) => (
              <div
                key={item.label}
                className="group rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-white shadow-lg transition-all duration-300 hover:bg-white/15 hover:scale-[1.02]"
              >
                <span className="text-3xl block mb-3">
                  {item.icon}
                </span>

                <div className="font-semibold">
                  {item.label}
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}
