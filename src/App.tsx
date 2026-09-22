import { useEffect, useState } from "react";
import { checkAccount, deleteNotification, receiveNotification, sendMessage } from "./api/greenApi";
import { AuthForm } from "./components/AuthForm";
import { Chat } from "./components/Chat";
import type { Message } from "./types";
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
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [username, setUsername] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [chatId, setChatId] = useState("");
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
            apiUrl: apiUrl.trim(),
            idInstance: idInstance.trim(),
            apiTokenInstance: apiTokenInstance.trim(),
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
              setMessages((prev) => {
                const alreadyExists = prev.some(
                  (item) => item.id === body.idMessage,
                );

                if (alreadyExists) {
                  return prev;
                }

                return [
                  ...prev,
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
            apiUrl: apiUrl.trim(),
            idInstance: idInstance.trim(),
            apiTokenInstance: apiTokenInstance.trim(),
            receiptId,
          });
        } catch (error) {
          if (cancelled || isAbortError(error)) {
            return;
          }

          setPollingError(
            getErrorMessage(
              error,
              "Не удалось получить новые сообщения. Повторяем подключение.",
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
  }, [chatId, apiUrl, idInstance, apiTokenInstance]);

  const handleOpenChat = async () => {
    const trimmedApiUrl = apiUrl.trim();
    const trimmedIdInstance = idInstance.trim();
    const trimmedToken = apiTokenInstance.trim();
    const trimmedUsername = username.trim();

    if (
      !trimmedApiUrl ||
      !trimmedIdInstance ||
      !trimmedToken ||
      !trimmedUsername
    ) {
      return;
    }

    const normalizedUsername = trimmedUsername.startsWith("@")
      ? trimmedUsername
      : `@${trimmedUsername}`;

    setIsConnecting(true);
    setAuthError(null);

    try {
      const result = await checkAccount({
        apiUrl: trimmedApiUrl,
        idInstance: trimmedIdInstance,
        apiTokenInstance: trimmedToken,
        username: normalizedUsername,
      });

      if (!result.exist || !result.chatId) {
        setAuthError("Пользователь Telegram не найден.");
        return;
      }

      setUsername(normalizedUsername);
      setMessages([]);
      setChatId(result.chatId);
    } catch (error) {
      setAuthError(
        getErrorMessage(error, "Не удалось подключиться к GREEN-API."),
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
        apiUrl: apiUrl.trim(),
        idInstance: idInstance.trim(),
        apiTokenInstance: apiTokenInstance.trim(),
        chatId,
        message: text,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: result.idMessage,
          text,
          direction: "outgoing",
        },
      ]);

      setMessage("");
    } catch (error) {
      setChatError(
        getErrorMessage(error, "Не удалось отправить сообщение."),
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleChangeChat = () => {
    setChatId("");
    setUsername("");
    setMessage("");
    setMessages([]);
    setAuthError(null);
    setChatError(null);
    setPollingError(null);
  };

  return (
    <main className="page">
      <section className={chatId ? "chat-card" : "auth-card"}>
        {!chatId ? (
          <AuthForm
            idInstance={idInstance}
            apiTokenInstance={apiTokenInstance}
            username={username}
            apiUrl={apiUrl}
            isConnecting={isConnecting}
            error={authError}
            onIdInstanceChange={setIdInstance}
            onApiTokenInstanceChange={setApiTokenInstance}
            onUsernameChange={setUsername}
            onApiUrlChange={setApiUrl}
            onSubmit={handleOpenChat}
          />
        ) : (
          <Chat
            username={username}
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
    </main>
  );
}

export default App;
