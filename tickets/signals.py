from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Ticket


@receiver(post_save, sender=Ticket)
def notify_ticket_status_change(sender, instance, created, **kwargs):

    if created:
        return
    
    try:
        old_ticket = Ticket.objects.get(id=instance.id)
    except Ticket.DoesNotExist:
        return
    
    status_changed = old_ticket.status != instance.status
    assigned_changed = old_ticket.assigned_to_id != instance.assigned_to_id


    if old_ticket.status != instance.status:
        from notifications.models import Notification
        
        Notification.objects.create(
            user=instance.user,
            notification_type=Notification.Type.TICKET_STATUS,
            title=f'Статус заявки #{instance.id} изменён',
            message=f'Ваша заявка "{instance.description[:50]}..." теперь в статусе: {instance.get_status_display()}',
            ticket=instance,
        )
    
    if old_ticket.assigned_to_id != instance.assigned_to_id and instance.assigned_to:
        from notifications.models import Notification
        
        Notification.objects.create(
            user=instance.user,
            notification_type=Notification.Type.TICKET_ASSIGNED,
            title=f'Назначен исполнитель для заявки #{instance.id}',
            message=f'На вашу заявку назначен: {instance.assigned_to.get_full_name() or instance.assigned_to.phone}',
            ticket=instance,
        )

    from notifications.models import Notification
    from users.models import UserFCMToken
    from conf.firebase import send_push_to_multiple_tokens
    
    # === 1. Уведомление об изменении статуса ===
    if status_changed:
        Notification.objects.create(
            user=instance.user,
            notification_type=Notification.Type.TICKET_STATUS,
            title=f'Статус заявки #{instance.id} изменён',
            message=f'Ваша заявка теперь в статусе: {instance.get_status_display()}',
            ticket=instance,
        )
    # Отправляем push
    tokens = UserFCMToken.objects.filter(
        user=instance.user, is_active=True
    ).values_list('token', flat=True)
    
    if tokens:
        send_push_to_multiple_tokens(
            tokens=tokens,
            title='📋 Статус заявки изменён',
            body=f'Ваша заявка #{instance.id} теперь: {instance.get_status_display()}',
            data={
                'type': 'ticket_status',
                'ticket_id': str(instance.id),
                'status': instance.status,
            }
        )
    # === 2. Уведомление о назначении исполнителя ===
    if assigned_changed and instance.assigned_to:
        Notification.objects.create(
            user=instance.user,
            notification_type=Notification.Type.TICKET_ASSIGNED,
            title=f'Назначен исполнитель для заявки #{instance.id}',
            message=f'На вашу заявку назначен: {instance.assigned_to.get_full_name() or instance.assigned_to.phone}',
            ticket=instance,
        )
        
        tokens = UserFCMToken.objects.filter(
            user=instance.user, is_active=True
        ).values_list('token', flat=True)
        
        if tokens:
            send_push_to_multiple_tokens(
                tokens=tokens,
                title='👷 Назначен исполнитель',
                body=f'На заявку #{instance.id} назначен специалист',
                data={
                    'type': 'ticket_assigned',
                    'ticket_id': str(instance.id),
                }
            )