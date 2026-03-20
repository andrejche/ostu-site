import { school } from "../data/school";

export default function Programs() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 text-slate-100 pt-28">
      <h1 className="text-3xl font-extrabold md:text-4xl">Стручни насоки</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
        Во ОСТУ „Гостивар“ се реализира настава во повеќе стручни насоки. Секоја насока
        комбинира теоретски предмети со практична настава во кабинети, работилници и
        компании–партнери.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {school.programs.map((p) => (
          <div
            className="rounded-2xl border border-white/5 bg-slate-900/50 p-5 shadow-sm"
            key={p}
          >
            <div className="text-base font-semibold text-white">{p}</div>
            <p className="mt-2 text-sm text-slate-300">
              Насока со современа програма и практична работа. Детален опис на
              наставните предмети, лабораториските вежби и можностите за вработување
              ќе биде додаден тука.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}