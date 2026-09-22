import { useEffect, useState, type SubmitEvent } from "react";
import {
  checkAccount,
  deleteNotification,
  receiveNotification,
  sendMessage,
} from "./api/greenApi";
import "./App.css";

type Message = {
  id: string;
  text: string;
  direction: "incoming" | "outgoing";
};

function App() {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [username, setUsername] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!chatId) {
      return;
    }

    let cancelled = false;

    const pollNotifications = async () => {
      while (!cancelled) {
        try {
          const notification = await receiveNotification({
            apiUrl: apiUrl.trim(),
            idInstance: idInstance.trim(),
            apiTokenInstance: apiTokenInstance.trim(),
          });

          if (cancelled) {
            return;
          }

          if (!notification) {
            continue;
          }

          console.log("Уведомление:", notification);

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
          console.error("Ошибка получения сообщений:", error);

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };

    pollNotifications();

    return () => {
      cancelled = true;
    };
  }, [chatId, apiUrl, idInstance, apiTokenInstance]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiUrl || !idInstance || !apiTokenInstance || !username) {
      return;
    }

    try {
      const result = await checkAccount({
        apiUrl: apiUrl.trim(),
        idInstance: idInstance.trim(),
        apiTokenInstance: apiTokenInstance.trim(),
        username: username.trim(),
      });

      console.log(result);

      if (!result.exist) {
        console.log("Пользователь не найден");
        return;
      }

      setChatId(result.chatId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!chatId || !message.trim()) {
      return;
    }

    try {
      const text = message.trim();

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
      console.error(error);
    }
  };

  return (
    <main className="page">
      <section className={chatId ? "chat-card" : "auth-card"}>
        {!chatId ? (
          <>
            <div className="auth-header">
              <span className="logo">G</span>

              <div>
                <h1>GREEN-API Chat</h1>
                <p>Подключите аккаунт и откройте чат в Telegram</p>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="idInstance">ID Instance</label>
                <input
                  type="text"
                  id="idInstance"
                  value={idInstance}
                  onChange={(event) => setIdInstance(event.target.value)}
                  placeholder="Введите ID Instance"
                />
              </div>

              <div className="field">
                <label htmlFor="apiTokenInstance">API Token Instance</label>
                <input
                  type="password"
                  id="apiTokenInstance"
                  value={apiTokenInstance}
                  onChange={(event) => setApiTokenInstance(event.target.value)}
                  placeholder="Введите API Token Instance"
                />
              </div>

              <div className="field">
                <label htmlFor="username">Telegram username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="@username"
                />
              </div>

              <div className="field">
                <label htmlFor="apiUrl">API URL</label>
                <input
                  type="text"
                  id="apiUrl"
                  value={apiUrl}
                  onChange={(event) => setApiUrl(event.target.value)}
                  placeholder="https://xxxx.api.green-api.com"
                />
              </div>

              <button
                type="submit"
                disabled={
                  !apiUrl || !idInstance || !apiTokenInstance || !username
                }
              >
                Открыть чат
              </button>
            </form>
          </>
        ) : (
          <div className="chat">
            <div className="chat-header">
              <strong>{username}</strong>
            </div>

            <div className="messages">
              {messages.map((item) => (
                <div key={item.id} className={`message ${item.direction}`}>
                  {item.text}
                </div>
              ))}
            </div>

            <form className="message-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Сообщение"
              />

              <button type="submit" disabled={!message.trim()}>
                Отправить
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
