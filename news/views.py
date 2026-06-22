from rest_framework import viewsets, permissions
from notifications.models import News
from .serializers import NewsSerializer


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