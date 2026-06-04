from rest_framework import permissions

class IsOwnerOrStaff(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        
        if getattr(request.user, 'is_staff_member', False):
            return True
        
        return obj.user == request.user

