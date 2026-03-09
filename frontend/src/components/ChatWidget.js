import { useMemo, useRef, useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: "Здраво! Прашај ме за ОСТУ „Гостивар“." },
  ]);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef(null);

  const historyForApi = useMemo(
    () => msgs.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    [msgs]
  );

  const scrollDown = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    setMsgs((p) => [...p, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyForApi }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop();

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const payload = JSON.parse(part.slice(6));

          if (payload.delta) {
            setMsgs((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              copy[copy.length - 1] = { ...last, content: (last.content || "") + payload.delta };
              return copy;
            });
            scrollDown();
          }

          if (payload.done || payload.error) setStreaming(false);
        }
      }
    } catch {
      setStreaming(false);
      setMsgs((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: "Грешка со сервер. Пробај пак." };
        return copy;
      });
    } finally {
      setStreaming(false);
      scrollDown();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800"
      >
        {open ? "Close" : "Chat"}
      </button>

      {open && (
        <div className="mt-3 w-[340px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">School Assistant</div>
              <div className="text-xs text-slate-500">Live</div>
            </div>
            <span className="rounded-full bg-blue-700 px-2 py-1 text-[11px] font-semibold text-white">
              Online
            </span>
          </div>

          <div className="max-h-[340px] space-y-2 overflow-auto px-3 py-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed " +
                  (m.role === "user"
                    ? "ml-auto bg-blue-700 text-white"
                    : "mr-auto bg-slate-100 text-slate-900")
                }
              >
                {m.content || (streaming && i === msgs.length - 1 ? "…" : "")}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 border-t border-slate-200 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message…"
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={streaming}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-700"
            />
            <button
              onClick={send}
              disabled={streaming}
              className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {streaming ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}