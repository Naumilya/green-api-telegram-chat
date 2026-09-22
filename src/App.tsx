import { useEffect, useState } from "react";
import {
  checkAccount,
  deleteNotification,
  receiveNotification,
  sendMessage,
} from "./api/greenApi";
import { AuthForm } from "./components/AuthForm";
import { Chat } from "./components/Chat";
import type { Message } from "./types";
import {
  EMPTY_CONNECTION_FORM,
  normalizeTelegramUsername,
  type ConnectionField,
  type ConnectionFormValues,
} from "./utils/validation";
import "./App.css";

const RETRY_DELAY_MS = 1000;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return `${fallback} ${error.message}`;
  }

  return fallback;
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function App() {
  const [connection, setConnection] = useState<ConnectionFormValues>(
    EMPTY_CONNECTION_FORM,
  );
  const [chatId, setChatId] = useState("");
  const [activeUsername, setActiveUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [pollingError, setPollingError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const pollNotifications = async () => {
      while (!cancelled) {
        try {
          const notification = await receiveNotification({
            apiUrl: connection.apiUrl.trim(),
            idInstance: connection.idInstance.trim(),
            apiTokenInstance: connection.apiTokenInstance.trim(),
            signal: controller.signal,
          });

          if (cancelled) {
            return;
          }

          setPollingError(null);

          if (!notification) {
            continue;
          }

          const { receiptId, body } = notification;

          if (
            body.typeWebhook === "incomingMessageReceived" &&
            body.senderData?.chatId === chatId &&
            body.messageData?.typeMessage === "textMessage"
          ) {
            const text = body.messageData.textMessageData?.textMessage;

            if (text) {
              setMessages((current) => {
                const alreadyExists = current.some(
                  (item) => item.id === body.idMessage,
                );

                if (alreadyExists) {
                  return current;
                }

                return [
                  ...current,
                  {
                    id: body.idMessage,
                    text,
                    direction: "incoming",
                  },
                ];
              });
            }
          }

          await deleteNotification({
            apiUrl: connection.apiUrl.trim(),
            idInstance: connection.idInstance.trim(),
            apiTokenInstance: connection.apiTokenInstance.trim(),
            receiptId,
          });
        } catch (error) {
          if (cancelled || isAbortError(error)) {
            return;
          }

          setPollingError(
            getErrorMessage(
              error,
              "Повторная попытка будет выполнена автоматически.",
            ),
          );

          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
    };

    void pollNotifications();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    chatId,
    connection.apiUrl,
    connection.idInstance,
    connection.apiTokenInstance,
  ]);

  const handleConnectionChange = (
    field: ConnectionField,
    value: string,
  ) => {
    setConnection((current) => ({
      ...current,
      [field]: value,
    }));
    setAuthError(null);
  };

  const handleOpenChat = async () => {
    const apiUrl = connection.apiUrl.trim();
    const idInstance = connection.idInstance.trim();
    const apiTokenInstance = connection.apiTokenInstance.trim();
    const username = normalizeTelegramUsername(connection.username);

    setIsConnecting(true);
    setAuthError(null);

    try {
      const result = await checkAccount({
        apiUrl,
        idInstance,
        apiTokenInstance,
        username,
      });

      if (!result.exist || !result.chatId) {
        setAuthError("Пользователь Telegram не найден.");
        return;
      }

      setConnection((current) => ({
        ...current,
        username,
      }));
      setActiveUsername(username);
      setMessages([]);
      setChatError(null);
      setPollingError(null);
      setChatId(result.chatId);
    } catch (error) {
      setAuthError(
        getErrorMessage(error, "Проверьте параметры инстанса и попробуйте ещё раз."),
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendMessage = async () => {
    const text = message.trim();

    if (!chatId || !text || isSending) {
      return;
    }

    setIsSending(true);
    setChatError(null);

    try {
      const result = await sendMessage({
        apiUrl: connection.apiUrl.trim(),
        idInstance: connection.idInstance.trim(),
        apiTokenInstance: connection.apiTokenInstance.trim(),
        chatId,
        message: text,
      });

      setMessages((current) => [
        ...current,
        {
          id: result.idMessage,
          text,
          direction: "outgoing",
        },
      ]);

      setMessage("");
    } catch (error) {
      setChatError(
        getErrorMessage(error, "Проверьте соединение и попробуйте ещё раз."),
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleChangeChat = () => {
    setChatId("");
    setActiveUsername("");
    setMessage("");
    setMessages([]);
    setAuthError(null);
    setChatError(null);
    setPollingError(null);
    setConnection((current) => ({
      ...current,
      username: "",
    }));
  };

  return (
    <main className="page">
      <div className="page-shell">
        <div className="brand-bar">
          <span className="brand-mark" aria-hidden="true">
            G
          </span>
          <span>GREEN-API</span>
          <span className="brand-divider" aria-hidden="true">
            /
          </span>
          <span className="brand-product">Telegram Chat</span>
        </div>

        <section className={chatId ? "chat-card" : "auth-card"}>
          {!chatId ? (
            <AuthForm
              values={connection}
              isConnecting={isConnecting}
              serverError={authError}
              onChange={handleConnectionChange}
              onSubmit={handleOpenChat}
            />
          ) : (
            <Chat
              username={activeUsername}
              messages={messages}
              message={message}
              isSending={isSending}
              error={chatError}
              pollingError={pollingError}
              onMessageChange={setMessage}
              onSend={handleSendMessage}
              onChangeChat={handleChangeChat}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
