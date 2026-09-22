import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  hasConnectionFormErrors,
  normalizeTelegramUsername,
  validateConnectionForm,
} from "../src/utils/validation.ts";

describe("normalizeTelegramUsername", () => {
  it("adds @ when it is missing", () => {
    assert.equal(normalizeTelegramUsername("naumilya"), "@naumilya");
  });

  it("keeps an existing @ and trims spaces", () => {
    assert.equal(normalizeTelegramUsername("  @naumilya  "), "@naumilya");
  });

  it("returns an empty string for empty input", () => {
    assert.equal(normalizeTelegramUsername("   "), "");
  });
});

describe("validateConnectionForm", () => {
  const validValues = {
    apiUrl: "https://7103.api.green-api.com",
    idInstance: "1234567890",
    apiTokenInstance: "test-token",
    username: "@naumilya",
  };

  it("accepts a valid form", () => {
    const errors = validateConnectionForm(validValues);

    assert.deepEqual(errors, {});
    assert.equal(hasConnectionFormErrors(errors), false);
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

  it("requires a numeric ID Instance", () => {
    assert.equal(
      validateConnectionForm({ ...validValues, idInstance: "12ab" }).idInstance,
      "ID Instance должен содержать только цифры.",
    );
  });

  it("requires an API token", () => {
    assert.equal(
      validateConnectionForm({ ...validValues, apiTokenInstance: " " })
        .apiTokenInstance,
      "Укажите API Token Instance.",
    );
  });

  it("validates Telegram username format", () => {
    assert.ok(
      validateConnectionForm({ ...validValues, username: "@ab" }).username,
    );

    assert.deepEqual(
      validateConnectionForm({ ...validValues, username: "naumilya" }),
      {},
    );
  });
});
