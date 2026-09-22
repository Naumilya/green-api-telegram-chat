import type { Message } from "../types";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

interface ChatProps {
  username: string;
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
  username,
  messages,
  message,
  isSending,
  error,
  pollingError,
  onMessageChange,
  onSend,
  onChangeChat,
}: ChatProps) {
  const avatarLetter = username.replace(/^@/, "").charAt(0).toUpperCase() || "T";

  return (
    <div className="chat">
      <div className="chat-header">
        <div className="chat-user">
          <span className="chat-avatar" aria-hidden="true">
            {avatarLetter}
          </span>

          <div className="chat-user-copy">
            <strong>{username}</strong>
            <span className="connection-status">
              <span className="status-dot" aria-hidden="true" />
              GREEN-API подключён
            </span>
          </div>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={onChangeChat}
        >
          Сменить чат
        </button>
      </div>

      {pollingError ? (
        <div className="status-warning" role="status">
          <strong>Получение сообщений временно недоступно.</strong>
          <span>{pollingError}</span>
        </div>
      ) : null}

      <MessageList messages={messages} />

      {error ? (
        <div className="status-error chat-error" role="alert">
          <strong>Сообщение не отправлено.</strong>
          <span>{error}</span>
        </div>
      ) : null}

      <MessageInput
        value={message}
        isSending={isSending}
        onChange={onMessageChange}
        onSubmit={onSend}
      />
    </div>
  );
}
