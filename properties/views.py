from django.shortcuts import render

# Create your views here.


from rest_framework import generics, permissions
from .models import Apartament
from .serializers import ApartamentSerializer


class ApartmentListView(generics.ListAPIView):
    """
    Список всех квартир (для выбора в форме заявки).
    Доступно только авторизованным пользователям.
    """
    serializer_class = ApartamentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Apartament.objects.select_related(
            'entrance__house'
        ).all()