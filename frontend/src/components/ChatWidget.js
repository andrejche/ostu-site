import { useMemo, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
const API_URL = process.env.REACT_APP_API_URL;

export default function ChatWidget() {
  const { t } = useTranslation();

  const [open,      setOpen]      = useState(false);
  const [input,     setInput]     = useState("");
  const [msgs,      setMsgs]      = useState([
    { role: "assistant", content: t("chat.welcome") },
  ]);
  const [streaming, setStreaming] = useState(false);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const historyForApi = useMemo(
    () => msgs.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    [msgs]
  );

  const scrollDown = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  } else {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  }
  return () => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  };
}, [open]);

  useEffect(() => {
    scrollDown();
  }, [msgs]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    setMsgs((p) => [
      ...p,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyForApi }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      if (!res.body) throw new Error("No response body");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = "";

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
              copy[copy.length - 1] = {
                ...last,
                content: (last.content || "") + payload.delta,
              };
              return copy;
            });
          }

          if (payload.done || payload.error) setStreaming(false);
        }
      }
    } catch (e) {
      console.error("Chat error:", e);
      setStreaming(false);
      setMsgs((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: t("chat.error"),
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-6 right-4 z-50 sm:right-6 flex flex-col items-end">

        {open && (
          <div className="mb-3 w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:w-[360px]">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0B2E5B] flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {t("chat.title")}
                  </div>
                  <div className="text-xs text-green-500">● {t("chat.live")}</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="min-h-[260px] max-h-[260px] space-y-2 overflow-auto px-3 py-3">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={
                    "max-w-[85%] whitespace-pre-wrap px-3 py-2 text-sm leading-relaxed " +
                    (m.role === "user"
                      ? "ml-auto bg-[#0B2E5B] text-white rounded-2xl rounded-br-md shadow"
                      : "mr-auto bg-slate-100 text-slate-900 rounded-2xl rounded-bl-md shadow-sm")
                  }
                >
                  {m.content ||
                    (streaming && i === msgs.length - 1 ? (
                      <div className="flex gap-1 mt-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    ) : "")}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-slate-200 p-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder")}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={streaming}
                className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#0B2E5B]/30 text-slate-800"
              />
              <button
                onClick={send}
                disabled={streaming}
                className="rounded-full bg-[#0B2E5B] hover:bg-[#0a2750] text-white px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50"
              >
                ➤
              </button>
            </div>
          </div>
        )}

        {/* Floating button */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="rounded-full bg-slate-900 hover:bg-slate-800 transition p-3.5 text-white shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}