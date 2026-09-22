export type ConnectionFormValues = {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
  username: string;
};

export type ConnectionField = keyof ConnectionFormValues;

export type ConnectionFormErrors = Partial<
  Record<ConnectionField, string>
>;

export const EMPTY_CONNECTION_FORM: ConnectionFormValues = {
  apiUrl: "",
  idInstance: "",
  apiTokenInstance: "",
  username: "",
};

export function normalizeTelegramUsername(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export function validateConnectionForm(
  values: ConnectionFormValues,
): ConnectionFormErrors {
  const errors: ConnectionFormErrors = {};
  const apiUrl = values.apiUrl.trim();
  const idInstance = values.idInstance.trim();
  const apiTokenInstance = values.apiTokenInstance.trim();
  const username = normalizeTelegramUsername(values.username);
  const usernameWithoutAt = username.slice(1);

  if (!apiUrl) {
    errors.apiUrl = "Укажите API URL инстанса.";
  } else {
    try {
      const url = new URL(apiUrl);

      if (url.protocol !== "https:") {
        errors.apiUrl = "API URL должен начинаться с https://";
      }
    } catch {
      errors.apiUrl = "Введите корректный URL, например https://xxxx.api.green-api.com";
    }
  }

  if (!idInstance) {
    errors.idInstance = "Укажите ID Instance.";
  } else if (!/^\d+$/.test(idInstance)) {
    errors.idInstance = "ID Instance должен содержать только цифры.";
  }

  if (!apiTokenInstance) {
    errors.apiTokenInstance = "Укажите API Token Instance.";
  }

  if (!username) {
    errors.username = "Укажите Telegram username.";
  } else if (!/^[A-Za-z0-9_]{5,32}$/.test(usernameWithoutAt)) {
    errors.username =
      "Username должен содержать 5–32 латинских символа, цифры или _.";
  }

  return errors;
}

export function hasConnectionFormErrors(errors: ConnectionFormErrors) {
  return Object.keys(errors).length > 0;
}
