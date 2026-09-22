export interface CheckAccountResponse {
  exist: boolean;
  chatId?: string;
  username?: string;
  phoneNumber?: number;
  fromCache?: boolean;
}

interface CheckAccountParams {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
  username: string;
}

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
  extends Omit<NotificationParams, "signal"> {
  receiptId: number;
}

function normalizeApiUrl(apiUrl: string) {
  return apiUrl.replace(/\/+$/, "");
}

async function throwResponseError(response: Response): Promise<never> {
  const responseText = await response.text();
  const details = responseText ? `: ${responseText}` : "";

  throw new Error(`HTTP ${response.status}${details}`);
}

export async function checkAccount({
  apiUrl,
  idInstance,
  apiTokenInstance,
  username,
}: CheckAccountParams): Promise<CheckAccountResponse> {
  const response = await fetch(
    `${normalizeApiUrl(apiUrl)}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
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
}: DeleteNotificationParams): Promise<void> {
  const response = await fetch(
    `${normalizeApiUrl(apiUrl)}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    await throwResponseError(response);
  }
}
