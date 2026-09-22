# GREEN-API Telegram Chat

Минимальный React-клиент для обмена текстовыми сообщениями в Telegram через GREEN-API.

Проект выполнен как тестовое задание на позицию Frontend React Developer. Внутри используется Telegram API GREEN-API, а экран чата оформлен в тёмной стилистике, близкой к референсу MAX из задания.

## Возможности

- подключение по `apiUrl`, `idInstance` и `apiTokenInstance`;
- поиск получателя по номеру телефона или `@username`;
- отправка текстовых сообщений через `SendMessage`;
- получение входящих сообщений через `ReceiveNotification`;
- подтверждение обработки уведомлений через `DeleteNotification`;
- long polling с отменой запроса при смене чата;
- валидация формы и пользовательские сообщения об ошибках;
- автоскролл к новым сообщениям;
- отправка по Enter и перенос строки по Shift+Enter;
- лимит сообщения 4096 символов;
- возможность сменить чат без перезагрузки;
- адаптивная вёрстка;
- credentials не сохраняются в `localStorage`.

## Стек

- React 19
- TypeScript
- Vite
- CSS
- Oxlint
- Node.js Test Runner
- GREEN-API Telegram HTTP API

## Запуск локально

Рекомендуется Node.js 24+.

```bash
git clone https://github.com/Naumilya/green-api-telegram-chat.git
cd green-api-telegram-chat
npm install
npm run dev
```

Production-сборка:

```bash
npm run build
npm run preview
```

## Проверки

```bash
npm run lint
npm test
npm run build
```

Полная проверка одной командой:

```bash
npm run check
```

Тесты с coverage:

```bash
npm run test:coverage
```

GitHub Actions автоматически запускает lint, tests и production build для push в `main` и pull request.

## Что покрыто тестами

Проверяются:

- нормализация Telegram username;
- распознавание username и номера телефона;
- очистка форматированного номера телефона;
- валидация API URL;
- валидация `idInstance`;
- обязательность `apiTokenInstance`;
- формирование payload `CheckAccount` для username;
- формирование payload `CheckAccount` для номера телефона;
- тело запроса `SendMessage`;
- пустой ответ `ReceiveNotification`;
- `DeleteNotification`;
- обработка HTTP-ошибок.

## Настройка GREEN-API

Для работы нужен Telegram-инстанс GREEN-API.

В форме указываются:

- **idInstance**;
- **apiTokenInstance**;
- **apiUrl**;
- **получатель** — номер телефона в международном формате или Telegram username.

Примеры:

```text
+79991234567
@username
```

Для получения сообщений через HTTP API у инстанса должен быть настроен режим получения входящих уведомлений через HTTP API.

Документация:

- [CheckAccount](https://green-api.com/telegram/docs/api/service/CheckAccount/)
- [SendMessage](https://green-api.com/telegram/docs/api/sending/SendMessage/)
- [ReceiveNotification](https://green-api.com/telegram/docs/api/receiving/technology-http-api/ReceiveNotification/)
- [DeleteNotification](https://green-api.com/telegram/docs/api/receiving/technology-http-api/DeleteNotification/)

## Сценарий

1. Пользователь вводит параметры GREEN-API.
2. Вводит номер телефона получателя или `@username`.
3. Приложение вызывает `CheckAccount` и получает `chatId`.
4. Пользователь отправляет текст через `SendMessage`.
5. Входящие уведомления читаются через `ReceiveNotification`.
6. После обработки уведомление удаляется через `DeleteNotification`.
7. Ответ собеседника появляется в чате.

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
│   └── validation.ts
├── App.tsx
├── App.css
├── main.tsx
└── types.ts

tests/
├── greenApi.test.ts
└── validation.test.ts
```

## Ограничения

- один активный чат;
- только текстовые сообщения;
- история переписки с сервера не загружается;
- credentials очищаются после перезагрузки страницы;
- максимальная длина сообщения — 4096 символов.

## Безопасность

Не добавляйте реальные `apiTokenInstance` в исходный код, GitHub, публичные переменные окружения или скриншоты.

Данные подключения в приложении хранятся только в состоянии React до перезагрузки страницы.
