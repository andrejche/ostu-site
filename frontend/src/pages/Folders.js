import { useEffect, useRef, useState } from "react";
import bg from "../assets/hero.png";
import filesData from "../data/files.json";

// ─── Hooks ────────────────────────────────────────────────────────────────────
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

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity:   inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
    }}>
      {children}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function FolderIcon({ open }) {
  return open ? (
    <svg className="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M2 6a2 2 0 012-2h5l2 2h7a2 2 0 012 2v1H2V6zm0 4h20v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8z" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-7l-2-2H4z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className="w-5 h-5 text-[#0B2E5B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

// ─── Tree Node ────────────────────────────────────────────────────────────────
function TreeNode({ node, depth = 0, search }) {
  const [open, setOpen] = useState(depth === 0);

  const isFolder = node.type === "folder";

  const matchesSearch = (n, q) => {
    if (!q) return true;
    if (n.name.toLowerCase().includes(q)) return true;
    if (n.children) return n.children.some((c) => matchesSearch(c, q));
    return false;
  };

  if (search && !matchesSearch(node, search.toLowerCase())) return null;

  const effectiveOpen = search ? true : open;

  const handleClick = () => {
    if (isFolder) {
      setOpen((v) => !v);
    } else if (node.url) {
      window.open(node.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={
          "flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 group " +
          (isFolder
            ? "hover:bg-amber-50 hover:border-amber-200"
            : node.url
            ? "hover:bg-[#0B2E5B]/5 hover:border-[#0B2E5B]/20"
            : "opacity-50 cursor-default") +
          " border border-transparent"
        }
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        {isFolder && (
          <svg
            className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${effectiveOpen ? "rotate-90" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        )}

        {!isFolder && <span className="w-3.5 shrink-0" />}

        {isFolder ? <FolderIcon open={effectiveOpen} /> : <FileIcon />}

        <span className={
          "text-sm font-medium flex-1 truncate " +
          (isFolder ? "text-slate-800 group-hover:text-amber-700" : "text-slate-700 group-hover:text-[#0B2E5B]")
        }>
          {node.name}
        </span>

        {!isFolder && node.url && (
          <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0B2E5B] shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        )}
      </div>

      {isFolder && effectiveOpen && node.children?.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} search={search} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FileExplorer() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  try {
    setData(filesData);
    setLoading(false);
  } catch (err) {
    console.error("Failed to load files.json:", err);
    setError("Неуспешно вчитување на материјали.");
    setLoading(false);
  }
}, []);

  return (
    <div className="relative bg-slate-100">

      {/* ── IMAGE ── */}
      <div className="absolute inset-x-0 top-0 h-[60vh]">
        <img src={bg} alt="" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-slate-100" />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative mx-auto max-w-4xl px-4 pt-40 pb-24">

        {/* Header */}
        <Reveal delay={0.05}>
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md p-8 shadow-xl shadow-slate-200/60 mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B2E5B]/10 text-xl">📁</div>
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900">Материјали</h1>
                  <p className="text-slate-500 text-sm mt-0.5">Кликни на папка за да ја отвориш, на датотека за да ја преземеш</p>
                </div>
              </div>
              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Пребарај..."
                  className="w-full sm:w-56 rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E5B]/20"
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* File tree */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/60 overflow-hidden">

            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-slate-400 font-mono">ОСТУ / Материјали</span>
            </div>

            {/* Tree */}
            <div className="p-3">
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-sm animate-pulse">Вчитување...</div>
              ) : error ? (
                <div className="py-12 text-center text-red-400 text-sm">{error}</div>
              ) : data.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">Нема материјали.</div>
              ) : (
                data.map((node) => (
                  <TreeNode key={node.id} node={node} depth={0} search={search} />
                ))
              )}
            </div>

          </div>
        </Reveal>

        {/* Legend */}
        <Reveal delay={0.15}>
          <div className="mt-4 flex items-center gap-6 px-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <FolderIcon open={false} />
              <span>Папка — кликни за да ја отвориш</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileIcon />
              <span>Датотека — кликни за да ја отвориш</span>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}