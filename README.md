# Telechat · GREEN-API

Минимальный React-клиент для отправки и получения текстовых сообщений в Telegram через GREEN-API.

**Демо:** [naumilya.github.io/green-api-telegram-chat](https://naumilya.github.io/green-api-telegram-chat/)

Проект выполнен как тестовое задание на позицию Frontend React Developer. По условию задания вместо MAX разрешено использовать Telegram. Структура интерфейса чата основана на desktop-messenger референсе из задания: список чатов, шапка текущего диалога, область сообщений и composer.

## Что реализовано

- ввод `idInstance`, `apiTokenInstance` и `apiUrl`;
- создание чата по номеру телефона в международном формате;
- дополнительная поддержка `@username`;
- получение `chatId` через `CheckAccount`;
- отправка только текстовых сообщений через `SendMessage`;
- получение входящих уведомлений через `ReceiveNotification`;
- подтверждение обработки через `DeleteNotification`;
- long polling с отменой активного запроса при выходе из чата;
- фильтрация входящих сообщений по активному `chatId`;
- защита UI от дублирования одного и того же `idMessage`;
- отправка сообщения по Enter и перенос строки по Shift+Enter;
- лимит текста 4096 символов;
- автоскролл к последнему сообщению;
- поиск по текущему списку чатов;
- создание нового чата без перезагрузки страницы;
- адаптивный интерфейс для desktop, планшетов и телефонов;
- мобильная навигация с возвратом к созданию нового чата;
- валидация формы и пользовательские состояния ошибок;
- безопасные сообщения об ошибках без вывода ответа API и credentials;
- автоматическое переподключение с увеличиваемой задержкой;
- credentials не сохраняются в `localStorage`, `sessionStorage` или репозитории.

## Соответствие тестовому заданию

| Требование | Реализация |
| --- | --- |
| React | React + TypeScript |
| GREEN-API | Отдельный API-модуль `src/api/greenApi.ts` |
| Только текстовые сообщения | Да |
| Отправка `SendMessage` | Да |
| Получение через HTTP API | `ReceiveNotification` + `DeleteNotification` |
| Ввод `idInstance` / `apiTokenInstance` | Да |
| Новый чат по номеру телефона | Да |
| Ответ собеседника отображается в чате | Да, через long polling |
| Минимальный набор функций | Один активный диалог, текстовые сообщения, без медиа и истории |
| Визуальный прототип мессенджера | Sidebar + chat header + message area + composer |

## Стек

- React 19
- TypeScript
- Vite
- CSS
- Oxlint
- Node.js Test Runner
- GREEN-API Telegram HTTP API
- GitHub Actions

## Локальный запуск

Требуется Node.js 24+.

```bash
git clone https://github.com/Naumilya/green-api-telegram-chat.git
cd green-api-telegram-chat
npm ci
npm run dev
```

После запуска Vite выведет локальный адрес проекта.

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

`npm run check` последовательно выполняет lint, tests и production build.

В `.github/workflows/ci.yml` настроены проверки для push в `main` и pull request. Workflow `.github/workflows/deploy.yml` после успешной проверки собирает приложение и публикует его в GitHub Pages.

## Что покрыто тестами

Проверяется:

- нормализация Telegram username;
- определение получателя как номера телефона или username;
- очистка форматированного номера;
- валидация `apiUrl`;
- валидация `idInstance`;
- обязательность `apiTokenInstance`;
- payload `CheckAccount` для username;
- payload `CheckAccount` для номера телефона;
- payload `SendMessage`;
- пустая очередь `ReceiveNotification`;
- `DeleteNotification`;
- HTTP-ошибки GREEN-API;
- отбор только текстовых входящих сообщений текущего чата;
- игнорирование сообщений другого чата;
- игнорирование нетекстовых webhook;
- дедупликация по `idMessage`;
- форматирование времени сообщения.

## Настройка GREEN-API

Для работы нужен авторизованный Telegram-инстанс GREEN-API.

В форме приложения указываются:

- **idInstance**;
- **apiTokenInstance**;
- **apiUrl**;
- **получатель** — номер телефона или Telegram username.

Примеры:

```text
+79991234567
@username
```

Для HTTP API получения уведомлений у инстанса должен быть пустой `webhookUrl`, а `incomingWebhook` должен быть включён.

Документация GREEN-API:

- [CheckAccount](https://green-api.com/telegram/docs/api/service/CheckAccount/)
- [SendMessage](https://green-api.com/telegram/docs/api/sending/SendMessage/)
- [HTTP API](https://green-api.com/telegram/docs/api/receiving/technology-http-api/)
- [ReceiveNotification](https://green-api.com/telegram/docs/api/receiving/technology-http-api/ReceiveNotification/)
- [DeleteNotification](https://green-api.com/telegram/docs/api/receiving/technology-http-api/DeleteNotification/)

## Сценарий использования

1. Создать и авторизовать Telegram-инстанс GREEN-API.
2. Ввести параметры инстанса.
3. Указать номер телефона получателя или `@username`.
4. Нажать **«Подключиться»**.
5. Приложение вызывает `CheckAccount` и получает `chatId`.
6. Написать и отправить текстовое сообщение.
7. Собеседник отвечает в Telegram.
8. Ответ появляется в Telechat после получения уведомления через HTTP API.

## Структура

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
│   ├── messages.ts
│   └── validation.ts
├── App.tsx
├── App.css
├── main.tsx
└── types.ts

tests/
├── greenApi.test.ts
├── messages.test.ts
└── validation.test.ts
```

## Ограничения

Это намеренный MVP в рамках тестового задания:

- один активный чат;
- только текст;
- история сообщений не загружается после перезагрузки;
- медиа, реакции, группы и вложения не реализованы;
- credentials живут только в состоянии React до перезагрузки страницы.

## Безопасность

Не добавляйте реальные `apiTokenInstance` в исходный код, GitHub, публичные переменные окружения или скриншоты.

Все данные подключения вводятся пользователем в браузере и не сохраняются приложением.
