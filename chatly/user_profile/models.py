from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profile/image/', blank=True , null=True,default=None)
    first_name = models.CharField(max_length=12)
    last_name = models.CharField(max_length=8)
    bio = models.TextField()

    def __str__(self):
        return f"{self.user} {self.first_name}"