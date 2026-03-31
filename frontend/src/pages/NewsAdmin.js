import { useEffect, useRef, useState } from "react";
const API_URL = process.env.REACT_APP_API_URL;

const NEWS_API    = `${API_URL}/api/news`;
const TEACHER_API = `${API_URL}/api/teachers`;
const UPLOAD_API  = `${API_URL}/api/upload`;

if (!API_URL) {
  console.error("API URL missing!");
}

const authHeaders = (adminKey) => ({
  "Content-Type": "application/json",
  "x-admin-key": adminKey,
});

const emptyArticle = { title: "", excerpt: "", body: "", image: "", category: "", published: true };
const emptyTeacher = { name: "", subjects: [], image: "" };

async function verifyAdminKey(adminKey) {
  const res = await fetch(`${NEWS_API}/__auth-check__`, {
    method: "DELETE",
    headers: authHeaders(adminKey),
  });
  // Unauthorized means invalid key; other responses indicate key passed auth middleware.
  return !(res.status === 401 || res.status === 403);
}

// ─── Image Compression Component ───────────────────────────────────────────────────

function compressImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale  = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width  = img.width  * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: "image/jpeg" })), "image/jpeg", quality);
    };
    img.src = url;
  });
}

// ─── Image Upload Component ───────────────────────────────────────────────────
function ImageUpload({ value, onChange, adminKey }) {
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

const upload = async (file) => {
  if (!file) return;
  if (!adminKey) return;
  setUploading(true);

  // Compress image in browser before uploading
  const compressed = await compressImage(file, 1200, 0.8);

  const formData = new FormData();
  formData.append("image", compressed);
  try {
    const res  = await fetch(UPLOAD_API, {
      method: "POST",
      headers: { "x-admin-key": adminKey },
      body: formData,
    });
    const data = await res.json();
    if (data.url) onChange(data.url);
  } catch (e) {
    console.error("Upload failed", e);
  }
  setUploading(false);
};

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 cursor-pointer transition-colors " +
          (dragging
            ? "border-[#0B2E5B] bg-[#0B2E5B]/5"
            : "border-slate-200 bg-slate-50 hover:border-[#0B2E5B]/50 hover:bg-slate-100")
        }
      >
        {uploading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#0B2E5B]" />
            <span className="text-sm font-semibold">Се прикачува...</span>
          </div>
        ) : (
          <>
            <div className="text-3xl">📁</div>
            <div className="text-sm font-semibold text-slate-600">Повлечи слика овде или кликни за избор</div>
            <div className="text-xs text-slate-400">JPG, PNG, WEBP — макс 5MB</div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => upload(e.target.files[0])}
        />
      </div>

      {/* URL fallback */}
      <div className="mt-2 flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">или внеси URL</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <input
        className={inp + " mt-2"}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
      />

      {/* Preview */}
      {value && (
        <div className="mt-3 relative inline-block">
          <img src={value} alt="preview" className="h-24 w-24 rounded-2xl object-cover border border-slate-200 shadow-sm" />
          <button
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white text-xs font-bold shadow hover:bg-red-600"
          >×</button>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Shell ─────────────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState("news");
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const candidate = keyInput.trim();
    if (!candidate) {
      setAuthError("Внеси админ клуч.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");
    try {
      const valid = await verifyAdminKey(candidate);
      if (!valid) {
        setAuthError("Невалиден админ клуч.");
        return;
      }
      setAdminKey(candidate);
      setKeyInput("");
    } catch {
      setAuthError("Неуспешна проверка. Пробај повторно.");
    } finally {
      setAuthLoading(false);
    }
  };

  if (!adminKey) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-800">🔐 Админ најава</h1>
          <p className="mt-2 text-sm text-slate-500">
            Внеси админ клуч за пристап до Site Management Panel.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              className={inp}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Админ клуч"
              autoComplete="off"
            />
            {authError && <Msg msg={`Грешка: ${authError}`} />}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl bg-[#0B2E5B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0a2750] disabled:opacity-50"
            >
              {authLoading ? "Проверка..." : "Најави се"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-[#0B2E5B] px-6 py-5 shadow-lg">
        <div className="mx-auto max-w-5xl flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white">⚙️ Site Management Panel</h1>
            <p className="text-white/60 text-xs mt-0.5">ОСТУ „Гостивар"</p>
          </div>
          <div className="flex gap-2">
            {[{ key: "news", label: "📰 Вести" }, { key: "teachers", label: "👩‍🏫 Наставници" }].map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={
                  "rounded-xl px-4 py-2 text-sm font-bold transition-all " +
                  (tab === t.key
                    ? "bg-white text-[#0B2E5B] shadow"
                    : "text-white/70 hover:text-white hover:bg-white/10")
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setAdminKey("")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Одјава
          </button>
        </div>
        {tab === "news"     && <NewsTab adminKey={adminKey} />}
        {tab === "teachers" && <TeachersTab adminKey={adminKey} />}
      </div>
    </div>
  );
}

// ─── NEWS TAB ─────────────────────────────────────────────────────────────────
function NewsTab({ adminKey }) {
  const [articles, setArticles] = useState([]);
  const [form,     setForm]     = useState(emptyArticle);
  const [editing,  setEditing]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState("");

  const load = () => fetch(NEWS_API).then((r) => r.json()).then(setArticles).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!adminKey) return setMsg("Грешка: Внеси админ клуч.");
    setLoading(true);
    try {
      const url    = editing ? `${NEWS_API}/${editing}` : NEWS_API;
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: authHeaders(adminKey), body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(editing ? "Ажурирано!" : "Објавено!");
      setForm(emptyArticle); setEditing(null); load();
    } catch (e) { setMsg("Грешка: " + e.message); }
    setLoading(false);
  };

  const del = async (id) => {
    if (!adminKey) return setMsg("Грешка: Внеси админ клуч.");
    if (!window.confirm("Избриши ја оваа вест?")) return;
    await fetch(`${NEWS_API}/${id}`, { method: "DELETE", headers: authHeaders(adminKey) });
    load();
  };

  const edit = (a) => {
    setEditing(a._id);
    setForm({ title: a.title, excerpt: a.excerpt || "", body: a.body, image: a.image || "", category: a.category || "", published: a.published });
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <Card>
        <CardTitle>{editing ? "✏️ Уреди вест" : "➕ Нова вест"}</CardTitle>
        <div className="space-y-4">
          <Field label="Наслов *">
            <input className={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Наслов на вестта" />
          </Field>
          <Field label="Кратко резиме">
            <input className={inp} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Краток опис" />
          </Field>
          <Field label="Содржина *">
            <textarea rows={7} className={inp + " resize-none"} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Целосна содржина..." />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Категорија">
              <select className={inp} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">— Без категорија —</option>
                {["Настани","Уписи","Спорт","Проекти","Огласи"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Објави веднаш">
              <label className="flex items-center gap-3 cursor-pointer mt-3">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-[#0B2E5B]" />
                <span className="text-sm font-medium text-slate-700">Видливо за посетители</span>
              </label>
            </Field>
          </div>
          <Field label="Слика">
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} adminKey={adminKey} />
          </Field>
        </div>
        {msg && <Msg msg={msg} />}
        <div className="mt-6 flex gap-3">
          <PrimaryBtn onClick={save} disabled={loading || !form.title || !form.body}>
            {loading ? "Се зачувува…" : editing ? "Зачувај промени" : "Објави вест"}
          </PrimaryBtn>
          {editing && <SecondaryBtn onClick={() => { setForm(emptyArticle); setEditing(null); setMsg(""); }}>Откажи</SecondaryBtn>}
        </div>
      </Card>

      <SectionTitle>Сите вести</SectionTitle>
      <div className="space-y-3">
        {articles.length === 0 && <EmptyMsg>Нема вести.</EmptyMsg>}
        {articles.map((a) => (
          <div key={a._id} className="flex items-start justify-between gap-4 rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              {a.image
                ? <img src={a.image} alt={a.title} className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                : <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-xl">📰</div>
              }
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 truncate">{a.title}</span>
                  {a.category && <Chip>{a.category}</Chip>}
                  {!a.published && <Chip amber>Скриено</Chip>}
                </div>
                <div className="text-xs text-slate-400 mt-1">{new Date(a.createdAt).toLocaleDateString("mk-MK")}</div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <SmBtn onClick={() => edit(a)}>Уреди</SmBtn>
              <SmBtnRed onClick={() => del(a._id)}>Избриши</SmBtnRed>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TEACHERS TAB ─────────────────────────────────────────────────────────────
function TeachersTab({ adminKey }) {
  const [teachers, setTeachers] = useState([]);
  const [form,     setForm]     = useState(emptyTeacher);
  const [editing,  setEditing]  = useState(null);
  const [subInput, setSubInput] = useState("");
  const [msg,      setMsg]      = useState("");
  const [search,   setSearch]   = useState("");

  const load = () => fetch(TEACHER_API).then((r) => r.json()).then(setTeachers).catch(() => {});
  useEffect(() => { load(); }, []);

  const addSubject = () => {
    const s = subInput.trim();
    if (!s || form.subjects.includes(s)) return;
    setForm({ ...form, subjects: [...form.subjects, s] });
    setSubInput("");
  };

  const removeSubject = (s) => setForm({ ...form, subjects: form.subjects.filter((x) => x !== s) });

  const save = async () => {
    if (!adminKey) return setMsg("Грешка: Внеси админ клуч.");
    if (!form.name.trim()) return setMsg("Грешка: Името е задолжително.");
    try {
      const url    = editing !== null ? `${TEACHER_API}/${editing}` : TEACHER_API;
      const method = editing !== null ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: authHeaders(adminKey), body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(editing !== null ? "Ажурирано!" : "Додаден наставник!");
      setForm(emptyTeacher); setEditing(null); setSubInput(""); load();
    } catch (e) { setMsg("Грешка: " + e.message); }
  };

  const edit = (t, idx) => {
    setEditing(idx);
    setForm({ name: t.name, subjects: [...(t.subjects || [])], image: t.image || "" });
    setMsg(""); setSubInput("");
    window.scrollTo(0, 0);
  };

  const del = async (idx) => {
    if (!adminKey) return setMsg("Грешка: Внеси админ клуч.");
    if (!window.confirm("Избриши го наставникот?")) return;
    await fetch(`${TEACHER_API}/${idx}`, { method: "DELETE", headers: authHeaders(adminKey) });
    load();
  };

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Card>
        <CardTitle>{editing !== null ? "✏️ Уреди наставник" : "➕ Нов наставник"}</CardTitle>
        <div className="space-y-4">
          <Field label="Ime и презиме *">
            <input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Маријанчо Алексоски" />
          </Field>
          <Field label="Слика">
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} adminKey={adminKey} />
          </Field>
          <Field label="Предмети">
            <div className="flex gap-2">
              <input
                className={inp + " flex-1"}
                value={subInput}
                onChange={(e) => setSubInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubject())}
                placeholder="Внеси предмет па притисни Enter"
              />
              <button onClick={addSubject} className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition-colors shrink-0">
                + Додај
              </button>
            </div>
            {form.subjects.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.subjects.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 rounded-full bg-[#0B2E5B]/10 border border-[#0B2E5B]/20 px-3 py-1 text-xs font-medium text-[#0B2E5B]">
                    {s}
                    <button onClick={() => removeSubject(s)} className="text-[#0B2E5B]/50 hover:text-red-500 font-bold transition-colors">×</button>
                  </span>
                ))}
              </div>
            )}
          </Field>
        </div>
        {msg && <Msg msg={msg} />}
        <div className="mt-6 flex gap-3">
          <PrimaryBtn onClick={save} disabled={!form.name.trim()}>
            {editing !== null ? "Зачувај промени" : "Додај наставник"}
          </PrimaryBtn>
          {editing !== null && <SecondaryBtn onClick={() => { setForm(emptyTeacher); setEditing(null); setMsg(""); setSubInput(""); }}>Откажи</SecondaryBtn>}
        </div>
      </Card>

      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <SectionTitle>Сите наставници ({teachers.length})</SectionTitle>
        <input
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2E5B]/20 w-64"
          placeholder="🔍 Пребарај наставник..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <EmptyMsg>Нема наставници.</EmptyMsg>}
        {filtered.map((t, i) => (
          <div key={t.name + i} className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {t.image ? (
                  <img src={t.image} alt={t.name} className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0B2E5B] text-white text-xs font-extrabold">
                    {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-bold text-slate-900">{t.name}</div>
                  {t.subjects?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {t.subjects.map((s) => (
                        <span key={s} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <SmBtn onClick={() => edit(t, i)}>Уреди</SmBtn>
                <SmBtnRed onClick={() => del(i)}>Избриши</SmBtnRed>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
const inp = "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E5B]/20";

const Card       = ({ children }) => <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm mb-8">{children}</div>;
const CardTitle  = ({ children }) => <h2 className="text-xl font-bold text-slate-800 mb-6">{children}</h2>;
const Field      = ({ label, children }) => <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>{children}</div>;
const Msg        = ({ msg }) => <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${msg.startsWith("Грешка") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>{msg}</div>;
const SectionTitle  = ({ children }) => <h2 className="text-xl font-bold text-slate-800 mb-4">{children}</h2>;
const EmptyMsg   = ({ children }) => <div className="text-slate-400 text-sm py-4">{children}</div>;
const PrimaryBtn = ({ children, onClick, disabled }) => <button onClick={onClick} disabled={disabled} className="rounded-xl bg-[#0B2E5B] hover:bg-[#0a2750] disabled:opacity-50 px-6 py-3 text-sm font-bold text-white transition-colors">{children}</button>;
const SecondaryBtn = ({ children, onClick }) => <button onClick={onClick} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">{children}</button>;
const SmBtn      = ({ children, onClick }) => <button onClick={onClick} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">{children}</button>;
const SmBtnRed   = ({ children, onClick }) => <button onClick={onClick} className="rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors">{children}</button>;
const Chip       = ({ children, amber }) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${amber ? "bg-amber-100 text-amber-700" : "bg-[#0B2E5B]/10 text-[#0B2E5B]"}`}>{children}</span>;