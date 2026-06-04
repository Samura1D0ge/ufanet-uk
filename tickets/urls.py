from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet

# Роутер автоматически создаст все нужные URL-адреса для ViewSet
router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('', include(router.urls)),
]