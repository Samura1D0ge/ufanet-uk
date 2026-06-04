from django.contrib import admin

# Register your models here.

from .models import Notification, News


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'user__phone')
    readonly_fields = ('created_at',)


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'audience', 'house', 'is_active', 'created_at')
    list_filter = ('audience', 'is_active', 'created_at')
    search_fields = ('title', 'content')