from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import UserProfile
from django.contrib.auth.models import User
from .serializers import UserProfileSerializer
from accounts.models import FollowerSystem

# Create your views here.
class UpdateProfile(APIView):
    def post(self , request):
        user = request.user
        data = request.data
        profile = UserProfile.objects.get(user=user)

        # get the data sent by the user
        fname = data.get('fname','')
        lname = data.get('lname','')
        user_bio = data.get('user_bio','')
        profile_image = data.get('profile_image',None)

        # update the users profile
        profile.first_name = fname
        profile.last_name = lname
        profile.bio = user_bio
        profile.profile_image_url = profile_image

        profile.save()
        return Response(status=status.HTTP_200_OK)

class GetUserProfileView(APIView):
    def get(self , request):
        user = request.user
        try:
            username = user.username
            userid = user.id
            userprofile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(userprofile)

            context = {
                "userprofile":serializer.data,
                "user":{
                    "username":f"{username}",
                    "id":userid
                }
            }
            return Response(context, status=status.HTTP_200_OK)
        except :
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self , request):
        data = request.data
        current_user = request.user
        try :
            user = User.objects.get(username__iexact=data['user_username'])
            isFollowing = False
            queryset = FollowerSystem.objects.filter(follower=current_user,user=user)
            if len(queryset) > 0:
                isFollowing = True
            username = user.username
            userprofile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(userprofile)

            context = {
                "userprofile":serializer.data,
                "username":f"{username}",
                "isFollowing":isFollowing
            }
            return Response(context , status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)