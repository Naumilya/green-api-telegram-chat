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
    <div className="messages" aria-live="polite">
      {messages.length === 0 ? (
        <p className="empty-messages">Сообщений пока нет</p>
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
