from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    apartament_address = serializers.CharField(source='apartament.full_address', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'user', 'user_name', 'apartament', 'apartament_address',
            'category', 'description', 'status', 'status_display', 
            'priority', 'priority_display', 'assigned_to', 'photo', 'created_at'
        ]
    
        read_only_fields = ['user', 'status', 'assigned_to', 'created_at']

    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Описание проблемы слишком короткое (минимум 10 символов).")
        return value

