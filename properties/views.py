from rest_framework import generics, permissions
from .models import Apartament, House
from .serializers import ApartamentSerializer, HouseSerializer


class ApartmentListView(generics.ListAPIView):
    serializer_class = ApartamentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Apartament.objects.select_related('entrance__house').all()


class HouseListView(generics.ListAPIView):
    """Список всех домов (для выбора при создании новости)."""
    serializer_class = HouseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return House.objects.all()