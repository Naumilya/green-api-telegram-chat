# GREEN-API Telegram Chat

Минимальный веб-клиент для обмена текстовыми сообщениями в Telegram через GREEN-API.

Проект выполнен как тестовое задание на позицию Frontend React Developer. Приложение позволяет подключить Telegram-инстанс GREEN-API, найти собеседника по `@username`, отправлять текстовые сообщения и получать входящие сообщения через HTTP API.

## Возможности

- подключение по `apiUrl`, `idInstance` и `apiTokenInstance`;
- валидация параметров подключения до запроса к API;
- поиск Telegram-пользователя через `CheckAccount`;
- отправка текстовых сообщений через `SendMessage`;
- получение входящих сообщений через `ReceiveNotification`;
- подтверждение обработки уведомлений через `DeleteNotification`;
- long polling с отменой активного запроса при смене чата;
- состояния загрузки и пользовательские сообщения об ошибках;
- автоматическая прокрутка к новым сообщениям;
- отправка по Enter и перенос строки по Shift+Enter;
- счётчик длины сообщения и лимит 4096 символов;
- возможность сменить чат без перезагрузки страницы;
- адаптивный интерфейс;
- credentials не сохраняются в `localStorage` и не хранятся в репозитории.

## Стек

- React 19
- TypeScript
- Vite
- CSS
- Oxlint
- Node.js Test Runner
- GREEN-API Telegram HTTP API

## Запуск локально

Для проекта рекомендуется Node.js 24+ и npm.

```bash
git clone https://github.com/Naumilya/green-api-telegram-chat.git
cd green-api-telegram-chat
npm install
npm run dev
```

После запуска Vite выведет локальный адрес приложения в терминале.

Production-сборка:

```bash
npm run build
npm run preview
```

## Проверки

Линтер:

```bash
npm run lint
```

Тесты:

```bash
npm test
```

Тесты с coverage:

```bash
npm run test:coverage
```

Полная локальная проверка:

```bash
npm run check
```

Команда `check` последовательно запускает линтер, тесты и production-сборку.

В репозитории также настроен GitHub Actions workflow, который выполняет те же проверки для push в `main` и pull request.

## Что покрыто тестами

Тесты написаны без дополнительного test framework и используют встроенный Node.js Test Runner.

Проверяется:

- нормализация Telegram username;
- валидация API URL;
- валидация ID Instance;
- обязательность API Token Instance;
- формат Telegram username;
- формирование URL для `CheckAccount`;
- тело запроса `SendMessage`;
- пустой ответ `ReceiveNotification`;
- удаление уведомления через `DeleteNotification`;
- обработка HTTP-ошибок GREEN-API.

## Настройка GREEN-API

Для работы приложения нужен Telegram-инстанс GREEN-API.

В форме подключения необходимо указать:

- **API URL** — адрес API вашего инстанса;
- **ID Instance** — идентификатор инстанса;
- **API Token Instance** — токен доступа;
- **Telegram username** — имя пользователя собеседника.

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
7. Чтобы открыть другой диалог, нажмите **«Сменить чат»**.

## Структура проекта

```text
src/
├── api/
│   └── greenApi.ts
├── components/
│   ├── AuthForm.tsx
│   ├── Chat.tsx
│   ├── MessageInput.tsx
│   └── MessageList.tsx
├── utils/
│   └── validation.ts
├── App.tsx
├── App.css
├── main.tsx
└── types.ts

tests/
├── greenApi.test.ts
└── validation.test.ts
```

`App.tsx` отвечает за состояние приложения и orchestration API-запросов. UI разбит на небольшие компоненты, работа с GREEN-API вынесена в отдельный модуль, а правила валидации — в отдельный pure-модуль.

## Ограничения

В рамках тестового задания реализован минимальный сценарий:

- один активный чат;
- только текстовые сообщения;
- без загрузки истории переписки;
- без хранения credentials после перезагрузки страницы;
- максимальная длина отправляемого сообщения — 4096 символов.

## Безопасность

Не добавляйте реальные `apiTokenInstance` или другие приватные данные в исходный код, GitHub или публичные переменные окружения.

В текущей реализации данные подключения вводятся пользователем и хранятся только в состоянии приложения до перезагрузки страницы.
