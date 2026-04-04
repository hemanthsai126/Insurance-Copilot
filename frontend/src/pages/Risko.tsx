import { type FormEvent, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { riskoChat } from "../api";
import type { RiskoMessage } from "../types";

const STARTER_PROMPTS = [
  "What is the difference between occurrence vs claims-made GL?",
  "Explain coinsurance in commercial property in simple terms.",
  "What does surplus lines mean for a small business?",
];

const assistantMdClass =
  "prose prose-slate max-w-none text-sm leading-relaxed " +
  "prose-p:my-2 prose-headings:scroll-mt-20 prose-headings:font-semibold " +
  "prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-sm " +
  "prose-strong:text-slate-900 prose-a:text-teal-700 prose-a:underline-offset-2 " +
  "prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 " +
  "prose-table:w-full prose-table:min-w-full prose-table:border-collapse prose-table:text-sm " +
  "prose-th:border prose-th:border-slate-300 prose-th:bg-slate-100 prose-th:px-3 prose-th:py-2 prose-th:text-left " +
  "prose-td:border prose-td:border-slate-200 prose-td:px-3 prose-td:py-2 " +
  "prose-code:rounded-md prose-code:bg-slate-200/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-slate-800 prose-code:before:content-none prose-code:after:content-none " +
  "prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:border prose-pre:border-slate-700 " +
  "prose-blockquote:border-l-amber-400 prose-blockquote:text-slate-700";

const userMdClass =
  "prose prose-invert max-w-none text-sm leading-relaxed " +
  "prose-p:my-1 prose-headings:font-semibold prose-headings:text-white prose-h3:text-base " +
  "prose-strong:text-white prose-a:text-amber-100 " +
  "prose-table:w-full prose-table:text-sm prose-th:border-white/30 prose-td:border-white/25 " +
  "prose-code:bg-white/20 prose-code:text-white prose-code:before:content-none prose-code:after:content-none";

function ChatMarkdown({ content, variant }: { content: string; variant: "user" | "assistant" }) {
  const cls = variant === "assistant" ? assistantMdClass : userMdClass;
  return (
    <div className="max-w-full overflow-x-auto">
      <div className={cls}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default function Risko() {
  const [messages, setMessages] = useState<RiskoMessage[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm **Risko**. Ask me anything about **insurance**: P&C, life, health, underwriting, policy wording, claims, reinsurance, and risk. I won't answer unrelated topics, and I'm educational only — not licensed advice.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function sendText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const userMsg: RiskoMessage = { role: "user", content: trimmed };
    const historyForApi = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const out = await riskoChat(historyForApi);
      setMessages((prev) => [...prev, { role: "assistant", content: out.message }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await sendText(input);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 py-3 sm:px-6">
        <header className="mb-3 shrink-0 border-b border-amber-200/80 pb-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-700">Insurance-only assistant</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Risko</h1>
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm">
              Backend uses <strong>Ollama</strong> with <strong>Qwen 2.5</strong> by default (
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px]">ollama pull qwen2.5</code>
              ). No cloud API key required.
            </p>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[min(100%,52rem)] rounded-2xl px-4 py-3 shadow-sm sm:px-5 sm:py-4 ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-teal-600 to-teal-500 text-white"
                      : "border border-slate-100 bg-slate-50 text-slate-800"
                  }`}
                >
                  {m.role === "assistant" && (
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
                      Risko
                    </span>
                  )}
                  <ChatMarkdown content={m.content} variant={m.role === "user" ? "user" : "assistant"} />
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-500">
                  Risko is thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="shrink-0 border-t border-slate-200 bg-slate-50/80 p-4 sm:p-5">
            <p className="mb-2 text-xs text-slate-500">Try asking:</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={loading}
                  onClick={() => sendText(p)}
                  className="rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1.5 text-left text-xs text-amber-950 transition hover:bg-amber-100 disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>
            {error && (
              <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                {error}
              </div>
            )}
            <form onSubmit={onSubmit} className="flex gap-2">
              <textarea
                className="min-h-[52px] flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                placeholder="Ask about deductibles, EPLI, treaty reinsurance, policy audits…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendText(input);
                  }
                }}
                rows={2}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="self-end rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        <p className="mt-3 shrink-0 text-center text-xs text-slate-500">
          Educational demo only — not insurance, legal, or financial advice. Verify with licensed professionals.
        </p>
      </div>
    </div>
  );
}
