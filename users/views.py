from django.shortcuts import render

# Create your views here.

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer
from .models import UserFCMToken
from properties.models import Apartament
from .serializers import FCMTokenSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    
class RegisterFCMTokenView(generics.CreateAPIView):

    serializer_class = FCMTokenSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class UnregisterFCMTokenView(generics.DestroyAPIView):

    serializer_class = FCMTokenSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_object(self):
        token = self.request.data.get('token')
        return UserFCMToken.objects.get(token=token, user=self.request.user)
    

class UserProfileView(APIView):

    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ApartamentsListView(generics.ListAPIView):

    from properties.models import Apartament
    from properties.serializers import ApartamentSerializer
    
    serializer_class = ApartamentSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        # Можно добавить фильтрацию по дому пользователя
        return Apartament.objects.select_related('entrance__house').all()