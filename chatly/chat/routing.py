from .consumers import ChatConsumer
from django.urls import re_path

websocket_urlpatterns = [
    re_path(r'chat/(?P<username>\w+)',ChatConsumer.as_asgi()),
]

# ws://localhost:8000/chat/<someusername>/