export interface CheckAccountResponse {
  exist: boolean;
  chatId?: string;
  username?: string;
  phoneNumber?: number;
  fromCache?: boolean;
}

type CheckAccountTarget =
  | { username: string; phoneNumber?: never }
  | { phoneNumber: number; username?: never };

type CheckAccountParams = {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
} & CheckAccountTarget;

export interface SendMessageResponse {
  idMessage: string;
}

interface SendMessageParams {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
  chatId: string;
  message: string;
}

export interface NotificationBody {
  typeWebhook: string;
  idMessage: string;
  senderData?: {
    chatId: string;
  };
  messageData?: {
    typeMessage: string;
    textMessageData?: {
      textMessage: string;
    };
  };
}

export interface ReceiveNotificationResponse {
  receiptId: number;
  body: NotificationBody;
}

interface NotificationParams {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
  signal?: AbortSignal;
}

interface DeleteNotificationParams
  extends NotificationParams {
  receiptId: number;
}

export class GreenApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "GreenApiError";
    this.status = status;
  }
}

function normalizeApiUrl(apiUrl: string) {
  return apiUrl.replace(/\/+$/, "");
}

async function throwResponseError(response: Response): Promise<never> {
  const messages: Record<number, string> = {
    400: "GREEN-API отклонил запрос. Проверьте введённые данные.",
    401: "Неверные idInstance или apiTokenInstance.",
    403: "У инстанса нет доступа к этому методу.",
    404: "Метод или инстанс GREEN-API не найден.",
    429: "Слишком много запросов. Повторите попытку немного позже.",
    466: "Инстанс временно недоступен. Проверьте его состояние в GREEN-API.",
  };

  const message =
    messages[response.status] ??
    (response.status >= 500
      ? "GREEN-API временно недоступен. Повторите попытку позже."
      : `GREEN-API вернул ошибку ${response.status}.`);

  throw new GreenApiError(response.status, message);
}

export async function checkAccount({
  apiUrl,
  idInstance,
  apiTokenInstance,
  ...target
}: CheckAccountParams): Promise<CheckAccountResponse> {
  const response = await fetch(
    `${normalizeApiUrl(apiUrl)}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(target),
    },
  );

  if (!response.ok) {
    return throwResponseError(response);
  }

  return response.json();
}

export async function sendMessage({
  apiUrl,
  idInstance,
  apiTokenInstance,
  chatId,
  message,
}: SendMessageParams): Promise<SendMessageResponse> {
  const response = await fetch(
    `${normalizeApiUrl(apiUrl)}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        message,
      }),
    },
  );

  if (!response.ok) {
    return throwResponseError(response);
  }

  return response.json();
}

export async function receiveNotification({
  apiUrl,
  idInstance,
  apiTokenInstance,
  signal,
}: NotificationParams): Promise<ReceiveNotificationResponse | null> {
  const response = await fetch(
    `${normalizeApiUrl(apiUrl)}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
    { signal },
  );

  if (!response.ok) {
    return throwResponseError(response);
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text) as ReceiveNotificationResponse;
}

export async function deleteNotification({
  apiUrl,
  idInstance,
  apiTokenInstance,
  receiptId,
  signal,
}: DeleteNotificationParams): Promise<void> {
  const response = await fetch(
    `${normalizeApiUrl(apiUrl)}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
    {
      method: "DELETE",
      signal,
    },
  );

  if (!response.ok) {
    await throwResponseError(response);
  }
}
