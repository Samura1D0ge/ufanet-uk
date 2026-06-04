from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, permissions
from .models import Ticket
from .serializers import TicketSerializer
from .permissions import IsOwnerOrStaff

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_staff_member', False):
            return Ticket.objects.all().select_related('user', 'apartament__entrance__house')
        return Ticket.objects.filter(user=user).select_related('apartament__entrance__house')

    def perform_create(self, serializer):
        apartament = getattr(self.request.user, 'apartament', None)
        serializer.save(user=self.request.user, apartament=apartament)