# Cat Pinterest

## Реализованный функционал

- ✅ Авторизация, Валидация данных, Логирование, Тесты
- ✅ Котики, Лайки, Адаптивность, Бесконечная прокрутка
- ✅ Изменен openapi.yaml, потому что нельзя возвращать пароль в запросе на логин

## Стек технологий

- **Backend:** TypeScript, NestJS, PostgreSQL, TypeORM, Swagger, Jest, Docker
- **Frontend:** TypeScript, React, TailwindCSS, React Router, React-Query, React-hook-form, Zod, Axios, Shadcn/ui

## Запуск проекта

1.  **Настройка окружения:**
    Скопируйте файл с примером переменных окружения и отредактируйте, если нужно:
    ```bash
    cd api && cp .env.example .env
    cd ../front && cp .env.example .env
    ```
2.  **Запуск:**

    ```bash
    docker compose up -d
    ```

- Frontend: `http://localhost:8080`
- API: `http://localhost:8080/api`
- Docs: `http://localhost:8080/api/docs`

## Тестирование Backend

- **Unit-тесты:**
  ```bash
  npm run test
  ```
- **E2E-тесты:**
  ```bash
  npm run test:e2e
  ```
  Используется `docker-compose.test.yaml` для тестовой БД.
