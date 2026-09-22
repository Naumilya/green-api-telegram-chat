import type { Message } from "../types";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

interface ChatProps {
  recipient: string;
  messages: Message[];
  message: string;
  isSending: boolean;
  error: string | null;
  pollingError: string | null;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onChangeChat: () => void;
}

export function Chat({
  recipient,
  messages,
  message,
  isSending,
  error,
  pollingError,
  onMessageChange,
  onSend,
  onChangeChat,
}: ChatProps) {
  const avatarLetter =
    recipient.replace(/^[@+]/, "").charAt(0).toUpperCase() || "T";

  return (
    <div className="max-shell">
      <aside className="max-rail" aria-hidden="true">
        <span className="max-rail-logo">T</span>
        <span className="max-rail-item active">●</span>
        <span className="max-rail-item">■</span>
        <span className="max-rail-item">◷</span>
        <span className="max-rail-item">☆</span>
      </aside>

      <section className="max-chat">
        <header className="chat-header">
          <div className="chat-user">
            <span className="chat-avatar">{avatarLetter}</span>
            <div>
              <strong>{recipient}</strong>
              <span className="connection-status">
                Telegram через GREEN-API
              </span>
            </div>
          </div>

          <button
            className="change-chat-button"
            type="button"
            onClick={onChangeChat}
          >
            Сменить чат
          </button>
        </header>

        {pollingError ? (
          <div className="status-warning" role="status">
            {pollingError}
          </div>
        ) : null}

        <MessageList messages={messages} />

        {error ? (
          <div className="status-error chat-error" role="alert">
            {error}
          </div>
        ) : null}

        <MessageInput
          value={message}
          isSending={isSending}
          onChange={onMessageChange}
          onSubmit={onSend}
        />
      </section>
    </div>
  );
}
