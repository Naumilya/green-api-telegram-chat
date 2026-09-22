import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  appendUniqueMessage,
  formatMessageTime,
  getIncomingText,
} from "../src/utils/messages.ts";
import type { NotificationBody } from "../src/api/greenApi.ts";

function createBody(
  overrides: Partial<NotificationBody> = {},
): NotificationBody {
  return {
    typeWebhook: "incomingMessageReceived",
    idMessage: "message-1",
    senderData: {
      chatId: "chat-1",
    },
    messageData: {
      typeMessage: "textMessage",
      textMessageData: {
        textMessage: "Привет",
      },
    },
    ...overrides,
  };
}

describe("getIncomingText", () => {
  it("returns text for the active chat", () => {
    assert.equal(getIncomingText(createBody(), "chat-1"), "Привет");
  });

  it("ignores messages from another chat", () => {
    assert.equal(getIncomingText(createBody(), "chat-2"), null);
  });

  it("ignores non-text messages", () => {
    assert.equal(
      getIncomingText(
        createBody({
          messageData: {
            typeMessage: "imageMessage",
          },
        }),
        "chat-1",
      ),
      null,
    );
  });

  it("ignores unrelated webhooks", () => {
    assert.equal(
      getIncomingText(
        createBody({
          typeWebhook: "outgoingMessageStatus",
        }),
        "chat-1",
      ),
      null,
    );
  });
});

describe("appendUniqueMessage", () => {
  it("appends a new message", () => {
    const result = appendUniqueMessage([], {
      id: "1",
      text: "Привет",
      direction: "incoming",
    });

    assert.equal(result.length, 1);
  });

  it("does not append a duplicate id", () => {
    const initial = [
      {
        id: "1",
        text: "Привет",
        direction: "incoming" as const,
      },
    ];

    const result = appendUniqueMessage(initial, {
      id: "1",
      text: "Привет ещё раз",
      direction: "incoming",
    });

    assert.equal(result, initial);
  });
});

describe("formatMessageTime", () => {
  it("formats time without seconds", () => {
    const result = formatMessageTime(new Date(2026, 8, 22, 16, 5));

    assert.match(result, /^16:05$/);
  });
});
