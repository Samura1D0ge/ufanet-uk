from rest_framework import permissions


class IsAdminOrDispatcher(permissions.BasePermission):
    """Разрешает доступ только администраторам и диспетчерам."""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ('ADMIN', 'DISPATCHER')