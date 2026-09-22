import { useEffect, useRef } from "react";
import type { Message } from "../types";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="telechat-messages" aria-live="polite" aria-label="Сообщения">
      <span className="telechat-date-chip">Сегодня</span>

      {messages.length === 0 ? (
        <div className="telechat-empty">
          <strong>Чат открыт</strong>
          <span>Отправьте первое текстовое сообщение.</span>
        </div>
      ) : (
        messages.map((item) => (
          <div
            key={item.id}
            className={`telechat-message ${item.direction}`}
          >
            <span className="telechat-message-text">{item.text}</span>

            <span className="telechat-message-meta">
              {item.time ?? ""}
              {item.direction === "outgoing" ? (
                <span aria-hidden="true"> ✓</span>
              ) : null}
            </span>
          </div>
        ))
      )}

      <div ref={endRef} />
    </div>
  );
}
