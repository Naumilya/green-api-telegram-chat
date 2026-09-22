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
  return (
    <div className="chat">
      <div className="chat-header">
        <div>
          <span className="chat-label">Telegram</span>
          <strong>{username}</strong>
        </div>

        <button className="secondary-button" type="button" onClick={onChangeChat}>
          Сменить чат
        </button>
      </div>

      {pollingError ? (
        <p className="status-warning" role="status">
          {pollingError}
        </p>
      ) : null}

      <MessageList messages={messages} />

      {error ? (
        <p className="status-error chat-error" role="alert">
          {error}
        </p>
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
