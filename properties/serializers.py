from rest_framework import serializers
from .models import House, Entrance, Apartament


class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = ['id', 'address', 'city', 'street', 'building_number']


class EntranceSerializer(serializers.ModelSerializer):
    house = HouseSerializer(read_only=True)
    
    class Meta:
        model = Entrance
        fields = ['id', 'house', 'number']


class ApartamentSerializer(serializers.ModelSerializer):
    entrance = EntranceSerializer(read_only=True)
    full_address = serializers.CharField(read_only=True)

    class Meta:
        model = Apartament
        fields = [
            'id', 'entrance', 'number', 'floor',
            'apartament_type', 'total_area', 'room_count',
            'account_number', 'full_address'
        ]