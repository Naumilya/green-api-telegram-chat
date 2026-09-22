import type { NotificationBody } from "../api/greenApi";
import type { Message } from "../types";

export function formatMessageTime(date: Date = new Date()) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getIncomingText(
  body: NotificationBody,
  activeChatId: string,
): string | null {
  if (
    body.typeWebhook !== "incomingMessageReceived" ||
    body.senderData?.chatId !== activeChatId ||
    body.messageData?.typeMessage !== "textMessage"
  ) {
    return null;
  }

  const text = body.messageData.textMessageData?.textMessage?.trim();

  return text || null;
}

export function appendUniqueMessage(
  messages: Message[],
  message: Message,
): Message[] {
  if (messages.some((item) => item.id === message.id)) {
    return messages;
  }

  return [...messages, message];
}
