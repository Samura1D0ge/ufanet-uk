from django.db.models.signals import post_save
from django.dispatch import receiver
from tickets.models import Ticket
from .models import Notification


@receiver(post_save, sender=Ticket)
def ticket_status_changed(sender, instance, created, **kwargs):

    if created:
        return
    
    old_ticket = Ticket.objects.filter(id=instance.id).first()
    if not old_ticket:
        return
    
    status_changed = old_ticket.status != instance.status
    assigned_changed = old_ticket.assigned_to_id != instance.assigned_to_id
    
    if status_changed:
        Notification.objects.create(
            user=instance.user,
            notification_type=Notification.Type.TICKET_STATUS,
            title=f'Статус заявки #{instance.id} изменён',
            message=f'Ваша заявка "{instance.description[:50]}..." теперь в статусе: {instance.get_status_display()}',
            ticket=instance,
        )
    
    if assigned_changed and instance.assigned_to:
        Notification.objects.create(
            user=instance.user,
            notification_type=Notification.Type.TICKET_ASSIGNED,
            title=f'Исполнитель назначен на заявку #{instance.id}',
            message=f' На вашу заявку назначен исполнитель: {instance.assigned_to.get_full_name() or instance.assigned_to.phone}',
            ticket=instance,
        )