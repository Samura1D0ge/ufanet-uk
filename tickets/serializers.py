from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)
    apartament_address = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'user', 'user_name', 'user_phone',
            'apartament', 'apartament_address',
            'category', 'description', 'status', 'status_display',
            'priority', 'priority_display',
            'assigned_to', 'photo', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_apartament_address(self, obj):
        if not obj.apartament:
            return None
        return obj.apartament.full_address

    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Описание слишком короткое (минимум 10 символов).")
        return value