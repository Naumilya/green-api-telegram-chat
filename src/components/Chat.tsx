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
    recipient.replace(/^[@+]/, "").charAt(0).toUpperCase() || "@";

  return (
    <div className="telechat-shell">
      <aside className="telechat-sidebar">
        <header className="telechat-sidebar-header">
          <div className="telechat-logo">
            <span className="telechat-logo-mark">➤</span>
            <strong>Telechat</strong>
          </div>

          <button
            className="telechat-logout"
            type="button"
            onClick={onChangeChat}
            aria-label="Сменить чат"
            title="Сменить чат"
          >
            ↪
          </button>
        </header>

        <div className="telechat-sidebar-body">
          <div className="telechat-search-row">
            <div className="telechat-search">
              <span aria-hidden="true">⌕</span>
              <input
                value=""
                readOnly
                placeholder="Ваши чаты"
                aria-label="Поиск по чатам"
              />
            </div>

            <button
              className="telechat-new-chat"
              type="button"
              onClick={onChangeChat}
              aria-label="Новый чат"
              title="Новый чат"
            >
              +
            </button>
          </div>

          <button className="telechat-chat-item active" type="button">
            <span className="telechat-chat-avatar">{avatarLetter}</span>

            <span className="telechat-chat-copy">
              <strong>{recipient}</strong>
              <span>можешь прислать текстом</span>
            </span>

            <span className="telechat-chat-time">сейчас</span>
          </button>
        </div>

        <footer className="telechat-sidebar-footer">
          <span className="telechat-wifi" aria-hidden="true">⌁</span>
          <span>GREEN-API подключён</span>
          <span className="telechat-online-dot" aria-hidden="true" />
        </footer>
      </aside>

      <section className="telechat-main">
        <header className="telechat-chat-header">
          <div className="telechat-user">
            <span className="telechat-user-avatar">{avatarLetter}</span>

            <div className="telechat-user-copy">
              <strong>{recipient}</strong>
              <span>Telegram</span>
            </div>
          </div>

          <span className="telechat-chat-badge">
            <span aria-hidden="true">♢</span>
            Текстовый чат
          </span>
        </header>

        {pollingError ? (
          <div className="telechat-status warning" role="status">
            {pollingError}
          </div>
        ) : null}

        <MessageList messages={messages} />

        {error ? (
          <div className="telechat-status error" role="alert">
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
