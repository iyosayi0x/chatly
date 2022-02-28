from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class FollowerSystem(models.Model):
    follower = models.ForeignKey(User , related_name='follower' , on_delete=models.CASCADE)
    user = models.ForeignKey(User , related_name='user', on_delete=models.CASCADE)
    date_followed = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return self.user