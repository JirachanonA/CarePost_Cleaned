"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { CarePlan } from "@/lib/types/care-plan";
import { loadCarePlan } from "@/lib/care-plan-storage";
import { ArrowUp } from "lucide-react";
import { Logo, cx } from "@/components/ui";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What should I watch out for?",
  "Can I take ibuprofen with my medicine?",
  "When should I call my doctor?",
  "What foods should I avoid?",
];

export default function ChatPage() {
  const [plan, setPlan] = useState<CarePlan | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPlan(loadCarePlan());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...next, assistantMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, carePlan: plan }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: accumulated }]);
      }
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <main className="flex flex-1 flex-col px-5 pb-[calc(12rem+env(safe-area-inset-bottom))] pt-[calc(4.25rem+env(safe-area-inset-top))]">
      <header className="flex flex-col items-center text-center">
        <Logo size={56} />
        <h1 className="display mt-1 text-[28px] font-bold">Companion</h1>
        <p className="mt-0.5 text-[15px] text-label-2">
          {plan ? `Knows your plan: ${plan.diagnosis_or_reason}` : "General recovery questions"}
        </p>
      </header>

      {messages.length === 0 && (
        <div className="rise mt-8">
          <p className="text-center text-[17px] text-label-2">
            {plan
              ? "Ask anything about your recovery, medicines, or plan."
              : "Upload your discharge papers for answers about your own care."}
          </p>
          <div className="mt-5 flex flex-col gap-2.5">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{ "--i": i + 1 } as React.CSSProperties}
                className="rise pressable pill min-h-14 rounded-[22px] px-5 text-left text-[17px] font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3" aria-live="polite">
        {messages.map((msg, i) => (
          <div key={i} className={cx("rise flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cx(
                "max-w-[85%] px-4 py-3 text-[17px] leading-relaxed",
                msg.role === "user"
                  ? "rounded-[22px] rounded-br-md bg-brand-ink text-white"
                  : "rounded-[22px] rounded-bl-md bg-surface text-label"
              )}
            >
              {msg.role === "assistant" && msg.content ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    ul: ({ children }) => <ul className="mb-2 ml-5 list-disc space-y-1 last:mb-0">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 ml-5 list-decimal space-y-1 last:mb-0">{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : msg.content ? (
                msg.content
              ) : (
                <span className="flex gap-1.5 py-2" aria-label="Companion is typing">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="size-2 animate-pulse rounded-full bg-label-3"
                      style={{ animationDelay: `${d * 150}ms` }}
                    />
                  ))}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div ref={bottomRef} />

      {/* Composer floats above the tab bar */}
      <div className="fixed inset-x-0 bottom-[calc(6.25rem+env(safe-area-inset-bottom))] z-30 px-5">
        <div className="glass mx-auto flex max-w-[calc(32rem-2.5rem)] items-end gap-2 rounded-[28px] p-2 pl-5">
          <label htmlFor="chat-input" className="sr-only">Your question</label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question…"
            disabled={streaming}
            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent py-2.5 text-[17px] outline-none placeholder:text-label-3 disabled:opacity-50 [field-sizing:content]"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || streaming}
            aria-label="Send"
            className="pressable flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-ink text-white disabled:bg-label-3/40"
          >
            <ArrowUp className="size-5" strokeWidth={2.8} />
          </button>
        </div>
        <p className="mt-2 text-center text-[12px] text-label-3">Not medical advice. In an emergency, call 911.</p>
      </div>
    </main>
  );
}
