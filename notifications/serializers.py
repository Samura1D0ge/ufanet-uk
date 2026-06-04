from rest_framework import serializers
from .models import Notification, News


class NotificationSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    ticket_id = serializers.IntegerField(source='ticket.id', read_only=True, allow_null=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'type_display', 'title', 'message',
            'ticket_id', 'is_read', 'created_at'
        ]
        read_only_fields = fields


class NewsSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = News
        fields = [
            'id', 'title', 'content', 'audience', 'house',
            'is_active', 'author_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'author_name']