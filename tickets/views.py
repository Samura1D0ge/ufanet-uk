from rest_framework import viewsets, permissions
from .models import Ticket
from .serializers import TicketSerializer
from .permissions import IsOwnerOrStaff
import firebase_admin
from firebase_admin import credentials, messaging
from conf.firebase import send_push_notification

class TicketViewSet(viewsets.ModelViewSet):
    """
    CRUD для заявок.
    ModelViewSet автоматически разрешает: list, create, retrieve, update, partial_update, destroy
    """
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    # Инициализация Firebase Admin SDK
    cred = credentials.Certificate('practick-5ca0a-firebase-adminsdk-fbsvc-2f8c5f010b.json')
    firebase_admin.initialize_app(cred)

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_staff_member', False):
            return Ticket.objects.all().select_related('user', 'apartament__entrance__house')
        return Ticket.objects.filter(user=user).select_related('apartament__entrance__house')

    def perform_create(self, serializer):
        # Сохраняем заявку с текущим пользователем
        apartament = getattr(self.request.user, 'apartament', None)
        serializer.save(user=self.request.user, apartament=apartament)
    
    def perform_update(self, serializer):
        """Создаём уведомление при изменении статуса."""
        old_ticket = self.get_object()
        serializer.save()
        
        # Если изменился статус - создаём уведомление
        if old_ticket.status != serializer.instance.status:
            # Создаём запись в БД
            Notification.objects.create(
                user=serializer.instance.user,
                notification_type=Notification.Type.TICKET_STATUS,
                title=f'Статус заявки #{serializer.instance.id} изменён',
                message=f'Новый статус: {serializer.instance.get_status_display()}',
                ticket=serializer.instance,
            )
            
            # Отправляем push-уведомление
            if serializer.instance.user.fcm_token:
                send_push_notification(
                    fcm_token=serializer.instance.user.fcm_token,
                    title=f'Заявка #{serializer.instance.id}',
                    body=f'Статус изменён на: {serializer.instance.get_status_display()}',
                )
        
        # Если назначен исполнитель - создаём уведомление
        if old_ticket.assigned_to != serializer.instance.assigned_to and serializer.instance.assigned_to:
            Notification.objects.create(
                user=serializer.instance.user,
                notification_type=Notification.Type.TICKET_ASSIGNED,
                title=f'Заявка #{serializer.instance.id} назначена исполнителю',
                message='Исполнитель приступит к работе в ближайшее время',
                ticket=serializer.instance,
            )
            
            # Отправляем push-уведомление
            if serializer.instance.user.fcm_token:
                send_push_notification(
                    fcm_token=serializer.instance.user.fcm_token,
                    title=f'Заявка #{serializer.instance.id}',
                    body='Назначен исполнитель',
                )