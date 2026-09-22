import { useState, type FormEvent } from "react";
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
    <>
      <div className="auth-header">
        <span className="logo" aria-hidden="true">
          G
        </span>

        <div>
          <span className="eyebrow">Тестовое задание</span>
          <h1>GREEN-API Telegram Chat</h1>
          <p>Подключите свой Telegram-инстанс и откройте диалог по username.</p>
        </div>
      </div>

      <div className="secure-note">
        <span className="secure-note-icon" aria-hidden="true">
          ✓
        </span>
        <span>
          Данные подключения хранятся только в памяти браузера и очищаются
          после перезагрузки страницы.
        </span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <fieldset className="form-section">
          <legend>
            <span className="section-number">1</span>
            Данные GREEN-API
          </legend>

          <p className="section-description">
            Скопируйте параметры из настроек вашего Telegram-инстанса.
          </p>

          <div className="field">
            <div className="field-heading">
              <label htmlFor="apiUrl">API URL</label>
              <span className="required-label">обязательно</span>
            </div>

            <input
              type="url"
              id="apiUrl"
              value={values.apiUrl}
              onChange={(event) => updateField("apiUrl", event.target.value)}
              placeholder="https://xxxx.api.green-api.com"
              autoComplete="off"
              aria-invalid={Boolean(errors.apiUrl)}
              aria-describedby={
                errors.apiUrl ? "apiUrl-error" : "apiUrl-hint"
              }
            />

            {errors.apiUrl ? (
              <p className="field-error" id="apiUrl-error">
                {errors.apiUrl}
              </p>
            ) : (
              <p className="field-hint" id="apiUrl-hint">
                Базовый URL API вашего инстанса.
              </p>
            )}
          </div>

          <div className="form-row">
            <div className="field">
              <div className="field-heading">
                <label htmlFor="idInstance">ID Instance</label>
                <span className="required-label">обязательно</span>
              </div>

              <input
                type="text"
                inputMode="numeric"
                id="idInstance"
                value={values.idInstance}
                onChange={(event) =>
                  updateField("idInstance", event.target.value)
                }
                placeholder="Например, 1234567890"
                autoComplete="off"
                aria-invalid={Boolean(errors.idInstance)}
                aria-describedby={
                  errors.idInstance
                    ? "idInstance-error"
                    : "idInstance-hint"
                }
              />

              {errors.idInstance ? (
                <p className="field-error" id="idInstance-error">
                  {errors.idInstance}
                </p>
              ) : (
                <p className="field-hint" id="idInstance-hint">
                  Числовой идентификатор инстанса.
                </p>
              )}
            </div>

            <div className="field">
              <div className="field-heading">
                <label htmlFor="apiTokenInstance">API Token Instance</label>
                <span className="required-label">обязательно</span>
              </div>

              <div className="password-field">
                <input
                  type={showToken ? "text" : "password"}
                  id="apiTokenInstance"
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
                      : "apiTokenInstance-hint"
                  }
                />

                <button
                  className="token-toggle"
                  type="button"
                  onClick={() => setShowToken((current) => !current)}
                  aria-label={
                    showToken ? "Скрыть API Token Instance" : "Показать API Token Instance"
                  }
                >
                  {showToken ? "Скрыть" : "Показать"}
                </button>
              </div>

              {errors.apiTokenInstance ? (
                <p className="field-error" id="apiTokenInstance-error">
                  {errors.apiTokenInstance}
                </p>
              ) : (
                <p className="field-hint" id="apiTokenInstance-hint">
                  Токен не сохраняется после обновления страницы.
                </p>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="form-section recipient-section">
          <legend>
            <span className="section-number">2</span>
            Получатель
          </legend>

          <p className="section-description">
            Укажите Telegram username пользователя, которому хотите написать.
          </p>

          <div className="field">
            <div className="field-heading">
              <label htmlFor="username">Telegram username</label>
              <span className="required-label">обязательно</span>
            </div>

            <div className="username-field">
              <span className="username-prefix" aria-hidden="true">
                @
              </span>
              <input
                type="text"
                id="username"
                value={values.username.replace(/^@/, "")}
                onChange={(event) => updateField("username", event.target.value)}
                placeholder="username"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(errors.username)}
                aria-describedby={
                  errors.username ? "username-error" : "username-hint"
                }
              />
            </div>

            {errors.username ? (
              <p className="field-error" id="username-error">
                {errors.username}
              </p>
            ) : (
              <p className="field-hint" id="username-hint">
                Можно вводить с @ или без него.
              </p>
            )}
          </div>
        </fieldset>

        {serverError ? (
          <div className="status-error" role="alert">
            <strong>Не удалось открыть чат.</strong>
            <span>{serverError}</span>
          </div>
        ) : null}

        <button
          className="primary-button auth-submit"
          type="submit"
          disabled={isConnecting}
        >
          <span>{isConnecting ? "Подключаемся..." : "Открыть чат"}</span>
          {!isConnecting ? <span aria-hidden="true">→</span> : null}
        </button>

        <p className="form-footer">
          Нужные значения находятся в личном кабинете GREEN-API в настройках
          Telegram-инстанса.
        </p>
      </form>
    </>
  );
}
