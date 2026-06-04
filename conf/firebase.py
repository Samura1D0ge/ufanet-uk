import firebase_admin
from firebase_admin import credentials, messaging
from pathlib import Path
import os


# Путь к ключу Firebase
BASE_DIR = Path(__file__).resolve().parent.parent
CREDENTIALS_PATH = BASE_DIR / 'practick-5ca0a-firebase-adminsdk-fbsvc-2f8c5f010b.json'


def get_firebase_app():
    if not firebase_admin._apps:
        if not CREDENTIALS_PATH.exists():
            print(f"⚠️ Firebase ключ не найден: {CREDENTIALS_PATH}")
            return None
        
        cred = credentials.Certificate(str(CREDENTIALS_PATH))
        firebase_admin.initialize_app(cred)
    
    return firebase_admin.get_app()


def send_push_notification(token, title, body, data=None):
    """

    Args:
        token: FCM токен устройства пользователя
        title: Заголовок уведомления
        body: Текст уведомления
        data: Дополнительные данные (например, id заявки)
    """
    app = get_firebase_app()
    if not app:
        return False
    
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
            token=token,
            android=messaging.AndroidConfig(
                priority='high',
            ),
        )
        
        response = messaging.send(message)
        print(f"✅ Push отправлен: {response}")
        return True
        
    except Exception as e:
        print(f"❌ Ошибка отправки push: {e}")
        return False


def send_push_to_multiple_tokens(tokens, title, body, data=None):
    app = get_firebase_app()
    if not app:
        return 0
    
    try:
        messages = [
            messaging.Message(
                notification=messaging.Notification(title=title, body=body),
                data=data or {},
                token=token,
            )
            for token in tokens
        ]
        
        response = messaging.send_each(messages)
        print(f"✅ Отправлено push-уведомлений: {response.success_count}")
        return response.success_count
        
    except Exception as e:
        print(f" Ошибка массовой отправки: {e}")
        return 0