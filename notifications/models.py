from django.db import models

# Create your models here.

from django.conf import settings


class Notification(models.Model):
    
    class Type(models.TextChoices):
        TICKET_STATUS = 'TICKET_STATUS', 'Статус заявки изменён'
        TICKET_COMMENT = 'TICKET_COMMENT', 'Новый комментарий к заявке'
        TICKET_ASSIGNED = 'TICKET_ASSIGNED', 'Заявка назначена исполнителю'
        BILLING = 'BILLING', 'Начисление / квитанция'
        SYSTEM = 'SYSTEM', 'Системное'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name='Получатель',
    )
    
    notification_type = models.CharField(
        max_length=20,
        choices=Type.choices,
        verbose_name='Тип уведомления',
    )
    
    title = models.CharField(max_length=200, verbose_name='Заголовок')
    message = models.TextField(verbose_name='Текст уведомления')
    
    ticket = models.ForeignKey(
        'tickets.Ticket',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications',
    )
    
    is_read = models.BooleanField(default=False, db_index=True, verbose_name='Прочитано')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.get_notification_type_display()}: {self.title}'


class News(models.Model):
    
    class Audience(models.TextChoices):
        ALL = 'ALL', 'Всем жителям'
        HOUSE = 'HOUSE', 'Жителям конкретного дома'
    
    title = models.CharField(max_length=300, verbose_name='Заголовок')
    content = models.TextField(verbose_name='Текст новости')
    
    audience = models.CharField(
        max_length=10,
        choices=Audience.choices,
        default=Audience.ALL,
        verbose_name='Аудитория',
    )
    
    house = models.ForeignKey(
        'properties.House',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='news',
    )
    
    is_active = models.BooleanField(default=True, verbose_name='Активна')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Автор',
    )

    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
