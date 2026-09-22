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
    <div className="messages" aria-live="polite" aria-label="Сообщения">
      {messages.length === 0 ? (
        <div className="empty-messages">
          <span className="empty-messages-icon" aria-hidden="true">
            ↗
          </span>
          <strong>Чат открыт</strong>
          <span>Отправьте первое текстовое сообщение.</span>
        </div>
      ) : (
        messages.map((item) => (
          <div key={item.id} className={`message ${item.direction}`}>
            {item.text}
          </div>
        ))
      )}

      <div ref={endRef} />
    </div>
  );
}
