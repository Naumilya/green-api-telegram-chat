import { useState, type FormEvent, type ReactNode } from "react";
import {
  hasConnectionFormErrors,
  validateConnectionForm,
  type ConnectionField,
  type ConnectionFormErrors,
  type ConnectionFormValues,
} from "../utils/validation";

interface AuthFormProps {
  values: ConnectionFormValues;
  isConnecting: boolean;
  serverError: string | null;
  onChange: (field: ConnectionField, value: string) => void;
  onSubmit: () => void;
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

function TelegramMark() {
  return (
    <span className="telegram-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M20.5 4.2 3.9 10.6c-1.1.4-1.1 1.1-.2 1.4l4.3 1.3 1.6 4.9c.2.6.1.8.8.8.5 0 .8-.2 1-.4l2.1-2 4.4 3.2c.8.4 1.4.2 1.6-.8l2.8-13.2c.3-1.2-.5-1.8-1.8-1.3Z" />
      </svg>
    </span>
  );
}

export function AuthForm({
  values,
  isConnecting,
  serverError,
  onChange,
  onSubmit,
}: AuthFormProps) {
  const [errors, setErrors] = useState<ConnectionFormErrors>({});
  const [showToken, setShowToken] = useState(false);

  const updateField = (field: ConnectionField, value: string) => {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });

    onChange(field, value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateConnectionForm(values);
    setErrors(nextErrors);

    if (hasConnectionFormErrors(nextErrors)) {
      return;
    }

    onSubmit();
  };

  return (
    <div className="auth-layout">
      <aside className="auth-rail" aria-hidden="true">
        <span className="rail-brand">
          <Icon size={18}>
            <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
          </Icon>
        </span>

        <span className="rail-item active">
          <Icon size={17}>
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="M8 9h8M8 13h5" />
          </Icon>
        </span>

        <span className="rail-item">
          <Icon size={17}>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4l3 2" />
          </Icon>
        </span>

        <span className="rail-item">
          <Icon size={17}>
            <path d="m12 4 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 4Z" />
          </Icon>
        </span>
      </aside>

      <section className="auth-form-pane">
        <div className="telechat-brand">
          <TelegramMark />
          <span>Telechat</span>
        </div>

        <div className="auth-copy">
          <span className="auth-kicker">GREEN-API · TELEGRAM</span>
          <h1>
            Все сообщения
            <br />в одном окне
          </h1>
          <p>
            Подключите свой Telegram-инстанс, чтобы отправлять и получать
            текстовые сообщения.
          </p>
        </div>

        <form className="connect-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="idInstance">idInstance</label>
            <input
              id="idInstance"
              type="text"
              inputMode="numeric"
              value={values.idInstance}
              onChange={(event) =>
                updateField("idInstance", event.target.value)
              }
              placeholder="4100123456789"
              autoComplete="off"
              aria-invalid={Boolean(errors.idInstance)}
              aria-describedby={
                errors.idInstance ? "idInstance-error" : undefined
              }
            />
            {errors.idInstance ? (
              <p className="field-error" id="idInstance-error">
                {errors.idInstance}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="apiTokenInstance">apiTokenInstance</label>
            <div className="token-field">
              <input
                id="apiTokenInstance"
                type={showToken ? "text" : "password"}
                value={values.apiTokenInstance}
                onChange={(event) =>
                  updateField("apiTokenInstance", event.target.value)
                }
                placeholder="Введите токен"
                autoComplete="off"
                aria-invalid={Boolean(errors.apiTokenInstance)}
                aria-describedby={
                  errors.apiTokenInstance
                    ? "apiTokenInstance-error"
                    : undefined
                }
              />

              <button
                className="eye-button"
                type="button"
                onClick={() => setShowToken((current) => !current)}
                aria-label={showToken ? "Скрыть токен" : "Показать токен"}
              >
                {showToken ? (
                  <Icon size={18}>
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 4.4A10.9 10.9 0 0 1 12 4c5.3 0 9 5 9 8a11.8 11.8 0 0 1-2.1 3.7" />
                    <path d="M6.2 6.2C4.1 7.7 3 10.1 3 12c0 3 3.7 8 9 8 1.7 0 3.2-.5 4.5-1.2" />
                  </Icon>
                ) : (
                  <Icon size={18}>
                    <path d="M3 12c0-3 3.7-8 9-8s9 5 9 8-3.7 8-9 8-9-5-9-8Z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </Icon>
                )}
              </button>
            </div>

            {errors.apiTokenInstance ? (
              <p className="field-error" id="apiTokenInstance-error">
                {errors.apiTokenInstance}
              </p>
            ) : null}
          </div>

          <details className="server-settings">
            <summary>
              <Icon size={15}>
                <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
                <circle cx="16" cy="7" r="2" />
                <circle cx="8" cy="17" r="2" />
              </Icon>
              Настройки сервера
            </summary>

            <div className="field server-field">
              <label htmlFor="apiUrl">apiUrl</label>
              <input
                id="apiUrl"
                type="url"
                value={values.apiUrl}
                onChange={(event) => updateField("apiUrl", event.target.value)}
                placeholder="https://api.green-api.com"
                autoComplete="off"
                aria-invalid={Boolean(errors.apiUrl)}
                aria-describedby={errors.apiUrl ? "apiUrl-error" : undefined}
              />
              {errors.apiUrl ? (
                <p className="field-error" id="apiUrl-error">
                  {errors.apiUrl}
                </p>
              ) : null}
            </div>
          </details>

          <div className="field recipient-field">
            <label htmlFor="recipient">Получатель</label>
            <input
              id="recipient"
              type="text"
              value={values.recipient}
              onChange={(event) =>
                updateField("recipient", event.target.value)
              }
              placeholder="+79991234567 или @username"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={Boolean(errors.recipient)}
              aria-describedby={
                errors.recipient ? "recipient-error" : "recipient-hint"
              }
            />
            {errors.recipient ? (
              <p className="field-error" id="recipient-error">
                {errors.recipient}
              </p>
            ) : (
              <p className="field-hint" id="recipient-hint">
                Номер телефона в международном формате или Telegram username.
              </p>
            )}
          </div>

          {serverError ? (
            <div className="status-error" role="alert">
              {serverError}
            </div>
          ) : null}

          <button
            className="connect-button"
            type="submit"
            disabled={isConnecting}
          >
            <Icon size={17}>
              <path d="M5 12.5a10 10 0 0 1 14 0" />
              <path d="M8 15.5a6 6 0 0 1 8 0" />
              <path d="M11 18.5a2 2 0 0 1 2 0" />
            </Icon>
            {isConnecting ? "Подключаемся..." : "Подключиться"}
          </button>

          <p className="privacy-note">
            <Icon size={14}>
              <path d="M12 3 5.5 5.5v5.6c0 4.1 2.8 7.8 6.5 9 3.7-1.2 6.5-4.9 6.5-9V5.5L12 3Z" />
              <path d="m9.5 11.5 1.7 1.7 3.5-3.5" />
            </Icon>
            Данные доступа хранятся только до перезагрузки или закрытия вкладки
          </p>
        </form>
      </section>

      <aside className="auth-preview" aria-label="Пример интерфейса чата">
        <div className="preview-glow preview-glow-one" />
        <div className="preview-glow preview-glow-two" />

        <div className="phone-preview">
          <div className="preview-header">
            <span className="preview-avatar">АП</span>
            <div>
              <strong>Алексей Петров</strong>
              <span>в сети</span>
            </div>
          </div>

          <div className="preview-messages">
            <div className="preview-message incoming">
              Привет! Проект уже готов?
            </div>
            <div className="preview-message outgoing">
              Да, отправляю ссылку ✨
              <small>12:41 ✓</small>
            </div>
          </div>
        </div>

        <div className="preview-badges">
          <span>✓ Только текст</span>
          <span>✓ Ответы в реальном времени</span>
        </div>
      </aside>
    </div>
  );
}
