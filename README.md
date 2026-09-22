# GREEN-API Telegram Chat

Минимальный веб-клиент для обмена текстовыми сообщениями в Telegram через GREEN-API.

Проект выполнен как тестовое задание на позицию Frontend React Developer. Приложение позволяет подключить Telegram-инстанс GREEN-API, открыть чат по `@username`, отправлять сообщения и получать входящие сообщения через HTTP API.

## Возможности

- подключение по `apiUrl`, `idInstance` и `apiTokenInstance`;
- поиск Telegram-пользователя по `@username` через `CheckAccount`;
- отправка текстовых сообщений через `SendMessage`;
- получение входящих сообщений через `ReceiveNotification`;
- подтверждение обработки уведомлений через `DeleteNotification`;
- простой адаптивный интерфейс чата;
- данные доступа не сохраняются в `localStorage` и не хранятся в репозитории.

## Стек

- React 19
- TypeScript
- Vite
- CSS
- Oxlint
- GREEN-API Telegram HTTP API

## Запуск локально

Требуются Node.js и npm.

```bash
git clone https://github.com/Naumilya/green-api-telegram-chat.git
cd green-api-telegram-chat
npm install
npm run dev
```

После запуска Vite выведет локальный адрес приложения в терминале.

Для production-сборки:

```bash
npm run build
npm run preview
```

Проверка линтером:

```bash
npm run lint
```

## Настройка GREEN-API

Для работы приложения нужен Telegram-инстанс GREEN-API.

В форме подключения необходимо указать:

- **API URL** — адрес API вашего инстанса;
- **ID Instance** — идентификатор инстанса;
- **API Token Instance** — токен доступа;
- **Telegram username** — имя пользователя в формате `@username`.

Для получения сообщений через HTTP API у инстанса должен быть пустой `webhookUrl`, а получение входящих уведомлений должно быть включено.

Документация GREEN-API:

- [CheckAccount](https://green-api.com/telegram/docs/api/service/CheckAccount/)
- [SendMessage](https://green-api.com/telegram/docs/api/sending/SendMessage/)
- [ReceiveNotification](https://green-api.com/telegram/docs/api/receiving/technology-http-api/ReceiveNotification/)
- [DeleteNotification](https://green-api.com/telegram/docs/api/receiving/technology-http-api/DeleteNotification/)

## Как пользоваться

1. Создайте и авторизуйте Telegram-инстанс в GREEN-API.
2. Введите параметры инстанса в форму приложения.
3. Укажите `@username` собеседника.
4. Нажмите **«Открыть чат»**.
5. Отправьте текстовое сообщение.
6. Входящие текстовые сообщения появятся в чате автоматически.

## Структура проекта

```text
src/
├── api/
│   └── greenApi.ts   # запросы к GREEN-API
├── App.tsx           # состояние приложения и UI
├── App.css           # стили интерфейса
└── main.tsx          # точка входа
```

## Ограничения

В рамках тестового задания реализован минимальный сценарий:

- один активный чат;
- только текстовые сообщения;
- без загрузки истории переписки;
- без хранения credentials после перезагрузки страницы.

## Безопасность

Не добавляйте реальные `apiTokenInstance` или другие приватные данные в исходный код, GitHub или публичные переменные окружения.

В текущей реализации данные подключения вводятся пользователем и хранятся только в состоянии приложения до перезагрузки страницы.
