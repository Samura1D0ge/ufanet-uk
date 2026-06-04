from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserFCMToken


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'phone', 'email', 'first_name', 'last_name', 'role', 'apartament', 'is_verified')
        read_only_fields = ('id', 'phone', 'role', 'is_verified')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('phone', 'first_name', 'last_name', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({"password": "Пароли не совпадают."})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class FCMTokenSerializer(serializers.Serializer):
    """Сериализатор для регистрации FCM токена устройства."""
    token = serializers.CharField(max_length=500)
    device_type = serializers.ChoiceField(
        choices=['android', 'ios', 'web'],
        default='android',
    )

    def create(self, validated_data):
        token, created = UserFCMToken.objects.update_or_create(
            token=validated_data['token'],
            defaults={
                'user': self.context['request'].user,
                'device_type': validated_data['device_type'],
                'is_active': True,
            }
        )
        return token