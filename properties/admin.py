from django.contrib import admin
from .models import House, Entrance, Apartament
# Register your models here.


class EntranceInline(admin.TabularInline):
    model = Entrance
    extra = 1
    min_num = 1

class ApartamentInline(admin.TabularInline):
    model = Apartament
    extra = 1
    min_num = 0

@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'total_floors', 'total_apartaments', 'build_year')
    list_filter = ('city', 'build_year')
    search_fields = ('address', 'street', 'building_number')
    inlines = [EntranceInline]
    
    fieldsets = (
        ('Адрес', {
            'fields': ('city', 'street', 'building_number', 'address'),
        }),
        ('Характеристики', {
            'fields': ('total_floors', 'total_apartaments'),
        }),
    )

@admin.register(Entrance)
class EntranceAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'house', 'number')
    list_filter = ('house',)
    search_fields = ('house__address',)
    inlines = [ApartamentInline]


@admin.register(Apartament)
class ApartamentAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'entrance', 'number', 'floor', 'total_area', 'account_number')
    list_filter = ('entrance__house', 'apartament_type', 'floor')
    search_fields = ('number', 'account_number', 'entrance__house__address')
    raw_id_fields = ('entrance',)