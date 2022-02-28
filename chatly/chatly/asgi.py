import os
from channels.routing import ProtocolTypeRouter , URLRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
import chat.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatly.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    # # Just HTTP for now. (We can add other protocols later.)
    "websocket":AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                    chat.routing.websocket_urlpatterns
            )
        )
    )
})
