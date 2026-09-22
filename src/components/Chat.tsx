import { useState, type ReactNode } from "react";
import type { Message } from "../types";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

interface ChatProps {
  recipient: string;
  recipientMeta: string;
  messages: Message[];
  message: string;
  isSending: boolean;
  error: string | null;
  pollingError: string | null;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onChangeChat: () => void;
}

function Icon({
  children,
  size = 18,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function Chat({
  recipient,
  recipientMeta,
  messages,
  message,
  isSending,
  error,
  pollingError,
  onMessageChange,
  onSend,
  onChangeChat,
}: ChatProps) {
  const avatarLabel = recipient.startsWith("@")
    ? "@"
    : recipient.replace(/\D/g, "").slice(-2) || "+";

  const [searchQuery, setSearchQuery] = useState("");
  const lastMessage = messages.at(-1);
  const previewText = lastMessage?.text ?? "Сообщений пока нет";
  const previewTime = lastMessage?.time ?? "сейчас";
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isVisible =
    !normalizedQuery || recipient.toLowerCase().includes(normalizedQuery);

  return (
    <div className="telechat-shell">
      <aside className="telechat-sidebar">
        <header className="telechat-sidebar-header">
          <div className="telechat-logo">
            <span className="telechat-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M20.4 4.3 3.9 10.7c-1 .4-1 1.1-.2 1.4l4.2 1.3 1.6 4.9c.2.6.1.8.8.8.5 0 .8-.2 1-.4l2.1-2 4.4 3.2c.8.4 1.4.2 1.6-.8l2.8-13.2c.3-1.2-.5-1.8-1.8-1.3Z" />
              </svg>
            </span>
            <strong>Telechat</strong>
          </div>

          <button
            className="telechat-logout"
            type="button"
            onClick={onChangeChat}
            aria-label="Сменить чат"
            title="Сменить чат"
          >
            <Icon size={19}>
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
            </Icon>
          </button>
        </header>

        <div className="telechat-sidebar-body">
          <div className="telechat-search-row">
            <div className="telechat-search">
              <Icon size={16}>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" />
              </Icon>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
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

          {isVisible ? (
            <button className="telechat-chat-item active" type="button">
              <span className="telechat-chat-avatar">{avatarLabel}</span>

              <span className="telechat-chat-copy">
                <strong>{recipient}</strong>
                <span>{previewText}</span>
              </span>

              <span className="telechat-chat-time">{previewTime}</span>
            </button>
          ) : (
            <p className="telechat-no-results">Чаты не найдены</p>
          )}
        </div>

        <footer className="telechat-sidebar-footer">
          <Icon size={15}>
            <path d="M5 12.5a10 10 0 0 1 14 0" />
            <path d="M8 15.5a6 6 0 0 1 8 0" />
            <path d="M11 18.5a2 2 0 0 1 2 0" />
          </Icon>
          <span>GREEN-API подключён</span>
          <span className="telechat-online-dot" aria-hidden="true" />
        </footer>
      </aside>

      <section className="telechat-main">
        <header className="telechat-chat-header">
          <div className="telechat-user">
            <span className="telechat-user-avatar">{avatarLabel}</span>

            <div className="telechat-user-copy">
              <strong>{recipient}</strong>
              <span>{recipientMeta}</span>
            </div>
          </div>

          <span className="telechat-chat-badge">
            <Icon size={13}>
              <path d="M12 3 5.5 5.5v5.6c0 4.1 2.8 7.8 6.5 9 3.7-1.2 6.5-4.9 6.5-9V5.5L12 3Z" />
              <path d="m9.5 11.5 1.7 1.7 3.5-3.5" />
            </Icon>
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
