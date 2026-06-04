from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Notification, News
from .serializers import NotificationSerializer, NewsSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'updated': updated})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'count': count})


class NewsViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = NewsSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['audience', 'is_active']

    def get_queryset(self):
        user = self.request.user
        queryset = News.objects.filter(is_active=True)

        if getattr(user, 'is_resident', False) and user.apartament:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(audience=News.Audience.ALL) |
                Q(house=user.apartament.entrance.house)
            )

        return queryset.select_related('author', 'house')