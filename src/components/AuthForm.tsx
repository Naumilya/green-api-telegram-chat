import type { FormEvent } from "react";

interface AuthFormProps {
  idInstance: string;
  apiTokenInstance: string;
  username: string;
  apiUrl: string;
  isConnecting: boolean;
  error: string | null;
  onIdInstanceChange: (value: string) => void;
  onApiTokenInstanceChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onApiUrlChange: (value: string) => void;
  onSubmit: () => void;
}

export function AuthForm({
  idInstance,
  apiTokenInstance,
  username,
  apiUrl,
  isConnecting,
  error,
  onIdInstanceChange,
  onApiTokenInstanceChange,
  onUsernameChange,
  onApiUrlChange,
  onSubmit,
}: AuthFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const isDisabled =
    isConnecting ||
    !apiUrl.trim() ||
    !idInstance.trim() ||
    !apiTokenInstance.trim() ||
    !username.trim();

  return (
    <>
      <div className="auth-header">
        <span className="logo" aria-hidden="true">
          G
        </span>

        <div>
          <h1>GREEN-API Chat</h1>
          <p>Подключите аккаунт и откройте чат в Telegram</p>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="apiUrl">API URL</label>
          <input
            type="url"
            id="apiUrl"
            value={apiUrl}
            onChange={(event) => onApiUrlChange(event.target.value)}
            placeholder="https://xxxx.api.green-api.com"
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label htmlFor="idInstance">ID Instance</label>
          <input
            type="text"
            id="idInstance"
            value={idInstance}
            onChange={(event) => onIdInstanceChange(event.target.value)}
            placeholder="Введите ID Instance"
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label htmlFor="apiTokenInstance">API Token Instance</label>
          <input
            type="password"
            id="apiTokenInstance"
            value={apiTokenInstance}
            onChange={(event) => onApiTokenInstanceChange(event.target.value)}
            placeholder="Введите API Token Instance"
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label htmlFor="username">Telegram username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
            placeholder="@username"
            autoComplete="off"
          />
        </div>

        {error ? (
          <p className="status-error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="primary-button" type="submit" disabled={isDisabled}>
          {isConnecting ? "Подключение..." : "Открыть чат"}
        </button>
      </form>
    </>
  );
}
