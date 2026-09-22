import type { FormEvent } from "react";

interface MessageInputProps {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function MessageInput({
  value,
  isSending,
  onChange,
  onSubmit,
}: MessageInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Сообщение"
        rows={1}
        maxLength={4096}
        aria-label="Сообщение"
      />

      <button
        className="primary-button send-button"
        type="submit"
        disabled={isSending || !value.trim()}
      >
        {isSending ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}
