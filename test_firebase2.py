"""
Тестовый скрипт для проверки Firebase
Запуск: python test_firebase.py
"""
import os
import django

# Настраиваем Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conf.settings')
django.setup()

from conf.firebase import send_push_notification, get_firebase_app

def test_firebase_connection():
    """Проверяет подключение к Firebase."""
    print("🔥 Тестирование подключения к Firebase...")
    
    app = get_firebase_app()
    if app:
        print("✅ Firebase подключён успешно!")
        print(f"   Проект: {app.name}")
        return True
    else:
        print("❌ Firebase не подключён. Проверь, что файл ключа существует.")
        return False


def test_send_push():
    """Тест отправки push-уведомления."""
    print("\n📤 Тест отправки push-уведомления...")
    
    # Вставь сюда тестовый FCM токен (получишь из Firebase Console или мобилки)
    test_token = "eyJhbGciOiAiUlMyNTYiLCAidHlwIjogIkpXVCIsICJraWQiOiAiMmY4YzVmMDEwYmNlZjRhYmExNjRiOWJlOTA0ZmNhNjIzOTg2NWRjOSJ9.eyJpc3MiOiAiZmlyZWJhc2UtYWRtaW5zZGstZmJzdmNAcHJhY3RpY2stNWNhMGEuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCAic3ViIjogImZpcmViYXNlLWFkbWluc2RrLWZic3ZjQHByYWN0aWNrLTVjYTBhLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwgImF1ZCI6ICJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsICJ1aWQiOiAidGVzdF91c2VyXzEyMyIsICJpYXQiOiAxNzgwNTYwNjM4LCAiZXhwIjogMTc4MDU2NDIzOH0.pu5agz_ofmtsnvAVJf7mmRt4oEx6i1vTFyi1Ypjj0h7hOS9xVG1wpnbt5PtasZCVF3pL-Qu6jrN1Kp4r2cQ7Z3PBvLgPHKfJBiJVQvsN1kGThS1yPeiNmmw1BtQxMXyGvweiJHs9hbnTKWgfc-BbNoysJhHRF7-CN0KLR-hX_R_oMVSpZsR1RaXlowr2HhvcKarEwMuyAPM2Pf6ETlLKb0GksMxVhaFTuf8Y5WNuuzxIyfbm1obXcf_U8xrJ9NX6T4_bhu2kmkIIUlWNFGNgMd1bppKUgWQPJTdZPSKOOjbNkaNFGcTyEDoQdsN7IiIN1WqJwNoFgshiv_3-iRXmuQ"
    
    success = send_push_notification(
        token=test_token,
        title="🧪 Тестовое уведомление",
        body="Если ты это видишь — Firebase работает!",
        data={
            "type": "test",
            "message": "Hello from Django!"
        }
    )
    
    if success:
        print("✅ Push-уведомление отправлено!")
    else:
        print("❌ Ошибка при отправке push")


if __name__ == "__main__":
    print("=" * 50)
    print("FIREBASE TEST SCRIPT")
    print("=" * 50)
    
    if test_firebase_connection():
        test_send_push()
    
    print("=" * 50)