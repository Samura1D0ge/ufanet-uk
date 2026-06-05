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
        read_only_fields = ['user', 'status', 'created_at', 'updated_at']

    def get_apartament_address(self, obj):
        if not obj.apartament:
            return None
        
        parts = []
        
        # Дом
        if obj.apartament.entrance and obj.apartament.entrance.house:
            house = obj.apartament.entrance.house
            if house.address:
                parts.append(f"ул. {house.address}")
        
        # Подъезд
        if obj.apartament.entrance:
            parts.append(f"подъезд {obj.apartament.entrance.number}")
        
        # Квартира
        if obj.apartament.number:
            parts.append(f"кв. {obj.apartament.number}")
        
        return ", ".join(parts) if parts else None

    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Описание слишком короткое (минимум 10 символов).")
        return value
    
    