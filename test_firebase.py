import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth

# Инициализация SDK вашим JSON-файлом
cred = credentials.Certificate('practick-5ca0a-firebase-adminsdk-fbsvc-2f8c5f010b.json')
firebase_admin.initialize_app(cred)

# Генерация токена для любого тестового UID
uid = 'test_user_123'
custom_token = auth.create_custom_token(uid)

# Токен, который можно отправить на клиент или использовать для тестов
print("Тестовый токен:", custom_token.decode('utf-8'))