from django.urls import path
from .views import GetUserProfileView , UpdateProfile

urlpatterns = [
    path('get_user/', GetUserProfileView.as_view()),
    path('edit/', UpdateProfile.as_view())
]