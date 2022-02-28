from django.urls import path
from .views import FetchMessagesView , FetchChatThreadView

urlpatterns= [
    path('fetch_messages/',FetchMessagesView.as_view()),
    path('fetch_thread/', FetchChatThreadView.as_view())
]