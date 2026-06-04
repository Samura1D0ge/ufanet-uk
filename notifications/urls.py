from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, NewsViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'news', NewsViewSet, basename='news')

urlpatterns = [
    path('', include(router.urls)),
]