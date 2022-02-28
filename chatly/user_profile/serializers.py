from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('first_name','last_name','bio','profile_image',)
        model=UserProfile