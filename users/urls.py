from django.urls import path
from .views import RegisterView, CurrentUserView, RegisterFCMTokenView, UnregisterFCMTokenView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/me/', CurrentUserView.as_view(), name='auth_me'),
    path('auth/register-device/', RegisterFCMTokenView.as_view(), name='register_device'),
    path('auth/unregister-device/', UnregisterFCMTokenView.as_view(), name='unregister_device'),
]