from django.db import models

# Create your models here.

class House(models.Model):

    address = models.CharField(
        max_length=500,
        help_text='Полный адресс дома',
    )

    city = models.CharField(
        max_length=100,
        default='Москва',
        help_text= 'Название города',
    )

    street = models.CharField(
        max_length=100,
    )

    building_number = models.CharField(
        max_length= 20,
    )

    total_floors = models.PositiveIntegerField(
        help_text='Колличество этажей',
    )

    total_apartaments = models.PositiveIntegerField(
        default=0,
        help_text='Колличество квартир',
    )
    build_year = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = 'Дом'
        verbose_name_plural = 'Дома'
        ordering = ['city', 'street', 'building_number']
        unique_together = ['city', 'street', 'building_number']

    def __set__(self):
        return f'{self.city}, {self.street}, {self.building_number}'
    def update_apartament_count(self):
        self.total_apartaments = self.apatraments.count()
        self.save(update_fields = ['total=apartaments'])

class Entrance(models.Model):
    house = models.ForeignKey(
         House,
         on_delete=models.CASCADE,
         related_name='entrances',
         verbose_name='Дом',
     )
    number = models.PositiveIntegerField(
         help_text='Номер подъезда',  #0 если нет подъезда
     )

    class Meta:
         verbose_name = 'Подъезд'
         verbose_name_plural = 'Подъезды'
         ordering = ['house', 'number']
         unique_together = ['house', 'number']

    def __set__(self):
        return f'{self.house}, - подъезд {self.entrance}'
    
class Apartament(models.Model):

    class ApartamentType(models.TextChoices):
        FLAT = 'FLAT', 'квартира'
        ROOM = 'ROOM', 'команата'
        OFFICE = 'OFFICE', 'нежилое помещение'

    entrance = models.ForeignKey(
        Entrance,
        on_delete= models.CASCADE,
        related_name='apartaments',
        verbose_name = 'подъезд',
    )

    number = models.CharField(
        max_length= 20,
        help_text='Номер квартиры',
    )

    floor = models.PositiveIntegerField(
        help_text='Этаж'
    )
    apartament_type = models.CharField(
        max_length=10,
        choices=ApartamentType.choices,
        default=ApartamentType.FLAT,
    )

    total_area = models.DecimalField(
        max_digits= 10,
        decimal_places= 2,
        null=True,
        blank=True,
        help_text='Площадь квартиры'
    )
    living_area = models.DecimalField(
        max_digits= 10,
        decimal_places= 2,
        null=True,
        blank=True,
        help_text='жилая площадь квартиры'
    )

    room_count = models.PositiveIntegerField(
        default=1,
    )

    account_number = models.CharField(
        max_length=50,
        unique=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Квартира'
        verbose_name_plural = 'Квартиры'
        ordering = ['entrance__house', 'entrance__number', 'number']
        unique_together = ['entrance', 'number']
    
    def __str__(self):
        return f'{self.entrance.house}, кв. {self.number}'
    
    @property
    def full_address(self):
        """Полный адрес с номером квартиры."""
        return f'{self.entrance.house}, кв. {self.number}'


