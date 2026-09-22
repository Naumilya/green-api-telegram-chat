import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getRecipientLabel,
  hasConnectionFormErrors,
  normalizeTelegramUsername,
  parseRecipient,
  validateConnectionForm,
} from "../src/utils/validation.ts";

describe("normalizeTelegramUsername", () => {
  it("adds @ when it is missing", () => {
    assert.equal(normalizeTelegramUsername("naumilya"), "@naumilya");
  });

  it("keeps an existing @ and trims spaces", () => {
    assert.equal(normalizeTelegramUsername("  @naumilya  "), "@naumilya");
  });
});

describe("parseRecipient", () => {
  it("parses a Telegram username", () => {
    assert.deepEqual(parseRecipient("naumilya"), { username: "@naumilya" });
  });

  it("parses a phone number and removes formatting", () => {
    assert.deepEqual(parseRecipient("+7 (999) 123-45-67"), {
      phoneNumber: 79991234567,
    });
  });

  it("returns null for an invalid recipient", () => {
    assert.equal(parseRecipient("@ab"), null);
  });

  it("returns a display label for recipient", () => {
    assert.equal(getRecipientLabel("79991234567"), "+79991234567");
    assert.equal(getRecipientLabel("naumilya"), "@naumilya");
  });
});

describe("validateConnectionForm", () => {
  const validValues = {
    apiUrl: "https://api.green-api.com",
    idInstance: "1234567890",
    apiTokenInstance: "test-token",
    recipient: "@naumilya",
  };

  it("accepts a valid username recipient", () => {
    const errors = validateConnectionForm(validValues);

    assert.deepEqual(errors, {});
    assert.equal(hasConnectionFormErrors(errors), false);
  });

  it("accepts a valid phone recipient", () => {
    assert.deepEqual(
      validateConnectionForm({
        ...validValues,
        recipient: "+7 999 123-45-67",
      }),
      {},
    );
  });

  it("rejects an insecure or malformed API URL", () => {
    assert.equal(
      validateConnectionForm({ ...validValues, apiUrl: "http://example.com" })
        .apiUrl,
      "API URL должен начинаться с https://",
    );

    assert.ok(
      validateConnectionForm({ ...validValues, apiUrl: "not-a-url" }).apiUrl,
    );
  });

  it("requires a numeric idInstance", () => {
    assert.equal(
      validateConnectionForm({ ...validValues, idInstance: "12ab" }).idInstance,
      "idInstance должен содержать только цифры.",
    );
  });

  it("requires an API token", () => {
    assert.equal(
      validateConnectionForm({ ...validValues, apiTokenInstance: " " })
        .apiTokenInstance,
      "Укажите apiTokenInstance.",
    );
  });

  it("validates recipient format", () => {
    assert.ok(
      validateConnectionForm({ ...validValues, recipient: "@ab" }).recipient,
    );
  });
});
