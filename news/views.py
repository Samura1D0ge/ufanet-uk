from rest_framework import viewsets, permissions
from notifications.models import News
from .serializers import NewsSerializer
from conf.firebase import send_push_notification
from users.models import User


class NewsViewSet(viewsets.ModelViewSet):
    """
    Стандартный CRUD для новостей.
    ModelViewSet автоматически разрешает GET, POST, PUT, PATCH, DELETE.
    """
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

        users_with_tokens = User.objects.filter(fcm_token__isnull=False)
        news = serializer.save(author=self.request.user)

        for user in users_with_tokens:
            send_push_notification(
                fcm_token=user.fcm_token,
                title=f'Новая новость: {news.title}',
                body=news.content[:100] + '...' if len(news.content) > 100 else news.content,
            )