from threading import Thread
from .models import ChatThread

class GetChatThread(Thread):
    def __init__(self, sender , receiver):
        Thread.__init__(self)
        self.sender = sender
        self.receiver = receiver
        self.return_value = None

    def run(self):
        querySet = ChatThread.objects.get_thread(self.sender , self.receiver)
        self.return_value = querySet

    def join(self,*args):
        Thread.join(self,*args)
        return self.return_value