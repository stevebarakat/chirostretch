"use client";

import { useState, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import styles from "./ChatWidget.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Citation {
  title: string;
  url: string;
  sourceType: string;
  sourceId: string;
}

interface AssistantMessage extends Message {
  role: "assistant";
  citations?: Citation[];
}

type ChatMessage = Message | AssistantMessage;

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = (await res.json()) as {
        answer?: string;
        citations?: Citation[];
        error?: string;
      };

      const assistantMessage: AssistantMessage = {
        role: "assistant",
        content:
          data.answer ?? data.error ?? "Sorry, I couldn't generate a response.",
        citations: data.citations,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        className={styles.toggleButton}
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (next) {
            // Scroll to bottom when panel opens
            setTimeout(
              () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
              0,
            );
          }
        }}
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label="Chat assistant">
          <header className={styles.header}>
            <span className={styles.headerTitle}>Ask ChiroStretch</span>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </header>

          <div className={styles.messageList}>
            {messages.length === 0 && (
              <p className={styles.emptyState}>
                Ask me anything about ChiroStretch — services, locations, or
                what to expect at your first visit.
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.messageBubble} ${
                  msg.role === "user"
                    ? styles.messageBubbleUser
                    : styles.messageBubbleAssistant
                }`}
              >
                <p className={styles.messageText}>{msg.content}</p>

                {"citations" in msg &&
                  msg.citations &&
                  msg.citations.length > 0 && (
                    <div className={styles.citations}>
                      <span className={styles.citationsLabel}>Sources:</span>
                      <ul className={styles.citationList}>
                        {msg.citations.map((c, j) => (
                          <li key={j}>
                            <a
                              href={c.url}
                              className={styles.citationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {c.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}

            {isLoading && (
              <div
                className={`${styles.messageBubble} ${styles.messageBubbleAssistant}`}
              >
                <span className={styles.loadingDots}>
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <textarea
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={2}
              maxLength={1000}
              disabled={isLoading}
            />
            <button
              className={styles.sendButton}
              onClick={() => void sendMessage()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
