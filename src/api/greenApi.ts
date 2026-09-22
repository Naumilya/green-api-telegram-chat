// CheckAccount

export interface CheckAccountResponse {
  exist: boolean;
  chatId: string;
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

export async function checkAccount({
  apiUrl,
  idInstance,
  apiTokenInstance,
  username,
}: CheckAccountParams): Promise<CheckAccountResponse> {
  const normalizedApiUrl = apiUrl.replace(/\/$/, "");

  const response = await fetch(
    `${normalizedApiUrl}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

// SendMessage

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

export async function sendMessage({
  apiUrl,
  idInstance,
  apiTokenInstance,
  chatId,
  message,
}: SendMessageParams): Promise<SendMessageResponse> {
  const normalizedApiUrl = apiUrl.replace(/\/$/, "");

  const response = await fetch(
    `${normalizedApiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
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
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

// GetMessage

export interface GetMessageResponse {
  type: "incoming" | "outgoing";
  idMessage: string;
  timestamp: number;
  statusMessage?: string;
  description?: string;
  sendByApi?: boolean;
}

interface GetMessageParams {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
  chatId: string;
  idMessage: string;
}

export async function getMessage({
  apiUrl,
  idInstance,
  apiTokenInstance,
  chatId,
  idMessage,
}: GetMessageParams): Promise<GetMessageResponse> {
  const normalizedApiUrl = apiUrl.replace(/\/$/, "");

  const response = await fetch(
    `${normalizedApiUrl}/waInstance${idInstance}/getMessage/${apiTokenInstance}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        idMessage,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

// receiveNotification

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
}

export async function receiveNotification({
  apiUrl,
  idInstance,
  apiTokenInstance,
}: NotificationParams): Promise<ReceiveNotificationResponse | null> {
  const normalizedApiUrl = apiUrl.replace(/\/$/, "");

  const response = await fetch(
    `${normalizedApiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

// deleteNotification

interface DeleteNotificationParams extends NotificationParams {
  receiptId: number;
}

export async function deleteNotification({
  apiUrl,
  idInstance,
  apiTokenInstance,
  receiptId,
}: DeleteNotificationParams): Promise<void> {
  const normalizedApiUrl = apiUrl.replace(/\/$/, "");

  const response = await fetch(
    `${normalizedApiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
}
