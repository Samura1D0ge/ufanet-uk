from django.urls import path
from .views import ApartmentListView

urlpatterns = [
    path('apartments/', ApartmentListView.as_view(), name='apartments_list'),
]