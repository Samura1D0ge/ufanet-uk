from django.db import models
from django.conf import settings


class Ticket(models.Model):
    
    class Status(models.TextChoices):
        NEW = 'NEW', 'Новая'
        IN_PROGRESS = 'IN_PROGRESS', 'В работе'
        RESOLVED = 'RESOLVED', 'Решена'
        REJECTED = 'REJECTED', 'Отклонена'

    class Priority(models.TextChoices):
        LOW = 'LOW', 'Низкий'
        MEDIUM = 'MEDIUM', 'Средний'
        HIGH = 'HIGH', 'Высокий'

    class Category(models.TextChoices):
        PLUMBING = 'PLUMBING', 'Сантехника'
        ELECTRICAL = 'ELECTRICAL', 'Электрика'
        CLEANING = 'CLEANING', 'Уборка / Двор'
        SECURITY = 'SECURITY', 'Безопасность'
        OTHER = 'OTHER', 'Другое'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tickets',
        verbose_name='Заявитель'
    )
    
    apartament = models.ForeignKey(
        'properties.Apartament',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets',
        verbose_name='Квартира'
    )
    
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.OTHER,
        verbose_name='Категория'
    )
    
    description = models.TextField(
        verbose_name='Описание проблемы'
    )
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        db_index=True,
        verbose_name='Статус'
    )
    
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
        verbose_name='Приоритет'
    )
    
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tickets',
        verbose_name='Исполнитель'
    )
    
    photo = models.ImageField(
        upload_to='tickets_photos/',
        null=True,
        blank=True,
        verbose_name='Фото проблемы'
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
        ordering = ['-created_at']

    def __str__(self):
        return f'Заявка #{self.id} от {self.user} ({self.get_status_display()})'