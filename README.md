# Ufanet UK

Веб-приложение для работы с заявками жителей многоквартирного дома. В проекте есть интерфейсы жителя, диспетчера и сотрудников, а также новости и push-уведомления.

> Проект был создан в рамках производственной практики от университета.

## Возможности

- Регистрация и вход по номеру телефона.
- Создание и просмотр заявок жителей.
- Работа диспетчера с заявками и их распределение между сотрудниками.
- Просмотр новостей и создание новостей для пользователей.
- Push-уведомления через Firebase Cloud Messaging.

## Стек

- Backend: Python, Django, Django REST Framework, SQLite.
- Frontend: React, Vite, Axios.
- Push-уведомления: Firebase Cloud Messaging.

## Требования

- Python 3.12 или новее.
- Node.js и npm.

## Локальный запуск

### Backend

Из корневой папки проекта создайте и активируйте виртуальное окружение, затем установите зависимости и запустите миграции:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
$env:DJANGO_SECRET_KEY = .\.venv\Scripts\python.exe -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
python manage.py migrate
python manage.py runserver
```

Backend будет доступен по адресу `http://127.0.0.1:8000`.
Переменная задаётся для текущей сессии PowerShell; для последующих запусков задайте её снова или настройте в окружении.

### Frontend

В отдельном терминале:

```powershell
cd frontend
npm install
npm run dev
```

Vite выведет адрес локального frontend-приложения в терминале.

## Firebase

Для серверных push-уведомлений нужен Firebase Admin SDK service-account JSON-файл в корне проекта. Такой файл содержит секретный ключ, исключён из Git и не должен публиковаться. Без него функции отправки push-уведомлений работать не будут.

Клиентская Firebase-конфигурация находится в `frontend/src/firebase.js`. Перед использованием проекта со своей Firebase-конфигурацией замените значения в этом файле и настройте соответствующий проект Firebase Cloud Messaging.

## Примечание

Настройки backend и адрес API во frontend предназначены для локальной разработки. Для развёртывания потребуется отдельно настроить секреты, разрешённые хосты, CORS и адрес backend API.
