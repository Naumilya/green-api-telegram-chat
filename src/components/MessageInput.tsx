import type { FormEvent, KeyboardEvent } from "react";

const MAX_MESSAGE_LENGTH = 4096;

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

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();

      if (value.trim() && !isSending) {
        onSubmit();
      }
    }
  };

  return (
    <form className="telechat-composer" onSubmit={handleSubmit}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Напишите сообщение..."
        rows={1}
        maxLength={MAX_MESSAGE_LENGTH}
        aria-label="Сообщение"
      />

      <button
        className="telechat-send"
        type="submit"
        disabled={isSending || !value.trim()}
        aria-label="Отправить сообщение"
        title="Отправить"
      >
        {isSending ? "…" : "➤"}
      </button>
    </form>
  );
}
