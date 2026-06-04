from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.conf import settings

# Create your models here.

class CustomUserManager(BaseUserManager):

    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError('Телефон обязателен')
        
        phone = self.normalize_phone(phone)
        
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user
    

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Суперпользователь должен иметь is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Суперпользователь должен иметь is_superuser=True.')
        
        return self.create_user(phone, password, **extra_fields)
    
    @staticmethod
    def normalize_phone(phone):
        if phone:
            return ''.join(c for c in phone if c.isdigit() or c == '+')
        return phone





class User(AbstractUser):

    objects = CustomUserManager()

    class Role(models.TextChoices):
        RESIDENT = 'RESIDENT', 'Житель'
        DISPATCHER = 'DISPATCHER', 'Диспетчер'
        WORKER = 'WORKER', 'Работник'
        ADMIN = 'ADMIN', 'Админ'

    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(
        max_length= 12,
        unique=True,
        help_text='Номер для входа',
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default= Role.RESIDENT,
        db_index = True,
    )
    apartament = models.ForeignKey(
        'properties.Apartament',
        on_delete= models.SET_NULL,
        null=True,
        blank=True,
        related_name='residents',
    )

    is_verified = models.BooleanField(
        default=False,
        help_text='Подтвердил ли жител что реально живет',
    )

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['-date_joined']

    def __str__(self):
        return f'{self.get_full_name() or self.phone} ({self.get_role_display()})'
    
    @property
    def is_resident(self):
        return self.role == self.Role.RESIDENT
    
    @property
    def is_staff_member(self):
        return self.role in (self.Role.DISPATCHER, self.Role.WORKER, self.Role.ADMIN)
    
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []

class UserFCMToken(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='fcm_tokens',
    )
    token = models.CharField(
        max_length=500,
        unique=True,
        help_text='FCM токен устройства',
    )
    device_type = models.CharField(
        max_length=20,
        choices=[('android', 'Android'), ('ios', 'iOS'), ('web', 'Web')],
        default='android',
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'FCM Токен устройства'
        verbose_name_plural = 'FCM Токены'

    def __str__(self):
        return f'Токен для {self.user.phone} ({self.device_type})'




