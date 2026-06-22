from django.urls import path
from .views import ApartmentListView, HouseListView

urlpatterns = [
    path('apartments/', ApartmentListView.as_view(), name='apartments_list'),
    path('houses/', HouseListView.as_view(), name='houses_list'), 

]