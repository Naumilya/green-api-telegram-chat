import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  checkAccount,
  deleteNotification,
  receiveNotification,
  sendMessage,
} from "../src/api/greenApi.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("GREEN-API client", () => {
  it("checkAccount sends username to the normalized endpoint", async () => {
    let requestedUrl = "";
    let requestedInit: RequestInit | undefined;

    globalThis.fetch = async (input, init) => {
      requestedUrl = String(input);
      requestedInit = init;

      return new Response(
        JSON.stringify({
          exist: true,
          chatId: "123456789@c.us",
          username: "naumilya",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    };

    const result = await checkAccount({
      apiUrl: "https://example.green-api.com/",
      idInstance: "123",
      apiTokenInstance: "token",
      username: "@naumilya",
    });

    assert.equal(
      requestedUrl,
      "https://example.green-api.com/waInstance123/checkAccount/token",
    );
    assert.equal(requestedInit?.method, "POST");
    assert.deepEqual(JSON.parse(String(requestedInit?.body)), {
      username: "@naumilya",
    });
    assert.equal(result.exist, true);
    assert.equal(result.chatId, "123456789@c.us");
  });

  it("checkAccount can send phoneNumber", async () => {
    let body: unknown;

    globalThis.fetch = async (_input, init) => {
      body = JSON.parse(String(init?.body));

      return new Response(
        JSON.stringify({
          exist: true,
          chatId: "79991234567@c.us",
          phoneNumber: 79991234567,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    };

    await checkAccount({
      apiUrl: "https://example.green-api.com",
      idInstance: "123",
      apiTokenInstance: "token",
      phoneNumber: 79991234567,
    });

    assert.deepEqual(body, { phoneNumber: 79991234567 });
  });

  it("sendMessage sends the active chat and text", async () => {
    let body: unknown;

    globalThis.fetch = async (_input, init) => {
      body = JSON.parse(String(init?.body));

      return new Response(JSON.stringify({ idMessage: "message-id" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const result = await sendMessage({
      apiUrl: "https://example.green-api.com",
      idInstance: "123",
      apiTokenInstance: "token",
      chatId: "chat-id",
      message: "Привет",
    });

    assert.deepEqual(body, {
      chatId: "chat-id",
      message: "Привет",
    });
    assert.equal(result.idMessage, "message-id");
  });

  it("receiveNotification returns null for an empty queue response", async () => {
    globalThis.fetch = async () => new Response("", { status: 200 });

    const result = await receiveNotification({
      apiUrl: "https://example.green-api.com",
      idInstance: "123",
      apiTokenInstance: "token",
    });

    assert.equal(result, null);
  });

  it("deleteNotification uses DELETE and receiptId in the URL", async () => {
    let requestedUrl = "";
    let method = "";

    globalThis.fetch = async (input, init) => {
      requestedUrl = String(input);
      method = String(init?.method);

      return new Response("", { status: 200 });
    };

    await deleteNotification({
      apiUrl: "https://example.green-api.com/",
      idInstance: "123",
      apiTokenInstance: "token",
      receiptId: 42,
    });

    assert.equal(
      requestedUrl,
      "https://example.green-api.com/waInstance123/deleteNotification/token/42",
    );
    assert.equal(method, "DELETE");
  });

  it("includes HTTP status and response body in API errors", async () => {
    globalThis.fetch = async () =>
      new Response("invalid credentials", { status: 401 });

    await assert.rejects(
      () =>
        checkAccount({
          apiUrl: "https://example.green-api.com",
          idInstance: "123",
          apiTokenInstance: "bad-token",
          username: "@naumilya",
        }),
      /HTTP 401: invalid credentials/,
    );
  });
});
