export type ConnectionFormValues = {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
  recipient: string;
};

export type ConnectionField = keyof ConnectionFormValues;

export type ConnectionFormErrors = Partial<
  Record<ConnectionField, string>
>;

export type RecipientTarget =
  | { username: string; phoneNumber?: never }
  | { phoneNumber: number; username?: never };

export const EMPTY_CONNECTION_FORM: ConnectionFormValues = {
  apiUrl: "https://api.green-api.com",
  idInstance: "",
  apiTokenInstance: "",
  recipient: "",
};

export function normalizeTelegramUsername(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export function parseRecipient(value: string): RecipientTarget | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("@") || /[A-Za-z_]/.test(trimmed)) {
    const username = normalizeTelegramUsername(trimmed);
    const usernameWithoutAt = username.slice(1);

    if (!/^[A-Za-z0-9_]{5,32}$/.test(usernameWithoutAt)) {
      return null;
    }

    return { username };
  }

  const digits = trimmed.replace(/\D/g, "");

  if (!/^\d{7,15}$/.test(digits)) {
    return null;
  }

  return { phoneNumber: Number(digits) };
}

export function getRecipientLabel(value: string) {
  const target = parseRecipient(value);

  if (!target) {
    return value.trim();
  }

  if ("username" in target) {
    return target.username;
  }

  return `+${target.phoneNumber}`;
}

export function validateConnectionForm(
  values: ConnectionFormValues,
): ConnectionFormErrors {
  const errors: ConnectionFormErrors = {};
  const apiUrl = values.apiUrl.trim();
  const idInstance = values.idInstance.trim();
  const apiTokenInstance = values.apiTokenInstance.trim();

  if (!apiUrl) {
    errors.apiUrl = "Укажите API URL инстанса.";
  } else {
    try {
      const url = new URL(apiUrl);

      if (url.protocol !== "https:") {
        errors.apiUrl = "API URL должен начинаться с https://";
      }
    } catch {
      errors.apiUrl =
        "Введите корректный URL, например https://api.green-api.com";
    }
  }

  if (!idInstance) {
    errors.idInstance = "Укажите idInstance.";
  } else if (!/^\d+$/.test(idInstance)) {
    errors.idInstance = "idInstance должен содержать только цифры.";
  }

  if (!apiTokenInstance) {
    errors.apiTokenInstance = "Укажите apiTokenInstance.";
  }

  if (!values.recipient.trim()) {
    errors.recipient = "Укажите номер телефона или Telegram username.";
  } else if (!parseRecipient(values.recipient)) {
    errors.recipient =
      "Введите телефон в международном формате или username вида @username.";
  }

  return errors;
}

export function hasConnectionFormErrors(errors: ConnectionFormErrors) {
  return Object.keys(errors).length > 0;
}
