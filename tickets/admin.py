from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'apartament', 'category', 'status', 'priority', 'created_at')
    list_filter = ('status', 'priority', 'category', 'created_at')
    search_fields = ('user__phone', 'user__first_name', 'user__last_name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    
    raw_id_fields = ('user', 'apartament', 'assigned_to')
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'apartament', 'category', 'description', 'photo')
        }),
        ('Статус и исполнение', {
            'fields': ('status', 'priority', 'assigned_to')
        }),
        ('Системные поля', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )