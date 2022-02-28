from django.db import models
from django.contrib.auth.models import User
from django.db.models import Q
# Create your models here.
import threading

class MessageManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset()
    def fetch_messages(self, sender, receiver):
        first_lookup = Q(sender__username = sender , receiver__username = receiver)
        second_lookup = Q(sender__username = receiver , receiver__username = sender)
        return self.get_queryset().filter(first_lookup | second_lookup).order_by('time_stamp')

class Message(models.Model):
    sender = models.ForeignKey(User , on_delete=models.CASCADE, related_name='sendder')
    receiver = models.ForeignKey(User , on_delete=models.CASCADE, related_name='receiver')
    time_stamp = models.DateTimeField(auto_now_add=True)
    description= models.TextField()
    objects = MessageManager()

    def __str__(self):
        return f"{self.sender} to {self.receiver} at {self.time_stamp}"




class ChatThreadManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset()

    def get_thread(self,first_user,second_user):
        first_lookup = Q(first_user=first_user , second_user=second_user)
        second_lookup = Q(first_user=second_user , second_user=first_user)
        return self.get_queryset().filter(first_lookup | second_lookup)


class ChatThread(models.Model):
    # the user who instantiated the chat is going to be recorder as the first_user
    first_user = models.ForeignKey(User,on_delete=models.CASCADE, related_name='first_user')
    second_user = models.ForeignKey(User , on_delete=models.CASCADE, related_name='second_user')
    message = models.ForeignKey(Message , on_delete=models.CASCADE)
    seen = models.BooleanField(default=False)
    time_stamp=models.DateTimeField(auto_now_add=True)
    objects = ChatThreadManager()

    def save(self, *args , **kwargs):
        # check if a chat thread of both users already exists
        first_lookup = Q(first_user=self.first_user , second_user=self.second_user)
        second_lookup = Q(first_user=self.second_user , second_user=self.first_user)
        thread = ChatThread.objects.filter(first_lookup | second_lookup)
        if len(thread) == 0 :
            super(ChatThread,self).save(*args , **kwargs)
        else:
            thread.update(first_user=self.first_user ,
                                second_user=self.second_user,
                                seen=self.seen ,
                                message=self.message ,
                                )

    def __str__(self):
        return f"latest chat thread of {self.first_user} and {self.second_user}"