from rest_framework.views import APIView
from rest_framework import status , permissions
from rest_framework.response import Response
from django.contrib.auth import login , authenticate , logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import FollowerSystem
from user_profile.models import UserProfile
from django.views.decorators.csrf import ensure_csrf_cookie , csrf_protect
from django.utils.decorators import method_decorator
from .serializers import UserSerializer
from user_profile.models import UserProfile


#generates a csrf token for the user
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self , request, format=None):
        context = {
            'success':'CSRF cookie set'
        }
        return Response(context,status=status.HTTP_200_OK)

#create a user
@method_decorator(csrf_protect , name='dispatch')
class CreateUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        data = request.data
        form = UserCreationForm(data)
        if form.is_valid():
            form.save()
            cleaned_form_data = form.cleaned_data
            user = User.objects.get(username=cleaned_form_data['username'])
            UserProfile.objects.create(user=user , first_name='', last_name='' , bio='')
            return Response({"sign_up_message":"success"}, status=status.HTTP_200_OK)
        else :
            return Response({"sign_up_errors":form.errors})

#login user
@method_decorator(csrf_protect , name='dispatch')
class LoginUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        data = request.data
        username = data.get('username')
        password= data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request , user)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({"message":"failed"}, status=status.HTTP_404_NOT_FOUND)

# this view checks if the user is authenticated
class CheckAuthenticatedView(APIView):
    def get(self , request , format=None):
        isAuthenticated = User.is_authenticated
        print(isAuthenticated)
        if isAuthenticated :
            context={
                'detail':'user is authenticated'
            }
            return Response(context,status=status.HTTP_200_OK)
        else:
            return Response(status.HTTP_400_BAD_REQUEST)

# this view list out all the users in the app
class ListUsersView(APIView):
    permission_classes= (permissions.AllowAny,)
    def get(self , request, format=None):
        users = User.objects.all().order_by('id')
        serializer = UserSerializer(users,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


# this toggles between following and unfollowing a user
@method_decorator(csrf_protect , name='dispatch')
class ToggleFollowView(APIView):
    def post(self,request):
        data = request.data
        follower = request.user
        user = User.objects.get(username__iexact=data.get('user'))
        task = data.get('task')
        if task == 'follow':
            try:
                if(follower == user):
                    # you cant follow yourself
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                FollowerSystem.objects.get(user=user, follower=follower)
                # you can't follow someone you already follow
                return Response(status=status.HTTP_400_BAD_REQUEST)
            except FollowerSystem.DoesNotExist:
                # you can follow someone you don't follow
                if(follower == user):
                    # cannnot unfllow yourself
                    return Response(status = status.HTTP_400_BAD_REQUEST)
                FollowerSystem.objects.create(user=user, follower=follower)
                return Response(status=status.HTTP_200_OK)
        else:
            try:
                # you can unfollow someone you follow
                follower_model = FollowerSystem.objects.get(user=user, follower=follower)
                follower_model.delete()
                return Response(status=status.HTTP_200_OK)
            except FollowerSystem.DoesNotExist:
                # you can't unfollow someone you don't follow
                return Response(status, status=status.HTTP_400_BAD_REQUEST)

# this returns a data of the number of followers and following the user has
class FollowerCountView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self,request):
        data = request.data
        user = data["user_username"]
        if user == 'me':
            user = request.user
        else:
            user = User.objects.get(username__iexact=user)
        follower_count = len(FollowerSystem.objects.filter(user=user))
        following_count = len(FollowerSystem.objects.filter(follower=user))
        context = {
            "followers":f"{follower_count}",
            "following":f"{following_count}"
        }
        return Response(context, status=status.HTTP_200_OK)


class ListFollowingView(APIView):
    # list the users , current logged in user is following
    def get(self, request):
        user = request.user
        all_following = FollowerSystem.objects.filter(follower=user)
        context =[
            {"user":f"{following.user.username}", "id":following.user.id } for following in all_following
        ]
        return Response(context ,status=status.HTTP_200_OK)

    def post(self,request):
        # list the users , others user is following
        data = request.data
        username = data['user_username']
        current_user = request.user
        current_userFollowing = FollowerSystem.objects.filter(follower = current_user)
        # getting everyOne the current user is following
        current_userFollowingIds = [c_uf.user.id for c_uf in current_userFollowing]
        try :
            user = User.objects.get(username__iexact=username)
            current_user
            all_following = FollowerSystem.objects.filter(follower=user)
            context = [
                {
                    "user":f"{following.user.username}",
                    "id":following.user.id,
                    "isFollowing":True
                } if  following.user.id in current_userFollowingIds     else
                {
                    "user":f"{following.user.username}",
                    "id":following.user.id,
                    "isFollowing":False
                } for following in all_following
            ]
            return Response(context , status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST);


class ListFollowersView(APIView):
    # list the followers of current logged user
    def get(self,request):
        print(request)
        user = request.user
        followers = FollowerSystem.objects.filter(user=user)
        context =[
            {"user":f"{follower.follower.username}" , "id":follower.follower.id} for follower in followers
        ]
        return Response(context,status=status.HTTP_200_OK)

    # list the followers of other user
    def post(self,request):
        data = request.data
        current_user = request.user
        username = data['user_username']
        try :
            user = User.objects.get(username__iexact=username)
            current_userFollowing = FollowerSystem.objects.filter(follower = current_user)
            # getting everyOne the current user is following
            current_userFollowingIds = [c_uf.user.id for c_uf in current_userFollowing]
            # getting everyOne requested user is following
            followers = FollowerSystem.objects.filter(user=user)
            context = [
                {
                    "user":f"{follower.follower.username}",
                    "id":follower.follower.id,
                    "isFollowing":True
                } if follower.follower.id in current_userFollowingIds else
                {
                    "user":f"{follower.follower.username}",
                    "id":follower.follower.id,
                    "isFollowing":False
                } for follower in followers
            ]
            return Response(context,status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

# removes a user from your followers list
class RemoveFollowerView(APIView):
    def post(self ,request):
        data = request.data
        follower = data['user']
        user = request.user
        try:
            follower = User.objects.get(username__iexact=follower)
            queryset = FollowerSystem.objects.get(user=user , follower=follower)
            queryset.delete()
            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

# this view logouts the user
class LogoutUserView(APIView):
    def get(self , request):
        try:
            logout(request)
            context = {
                "detail":"user successfully logged out"
            }
            return Response(context , status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

#delete user view
class DeleteUserView(APIView):
    def delete(self, request, format=None):
        user = request.user
        try:
            user = User.objects.filter(id=user.id)
            user.delete()
            context = {
                'detail':'user successfully deleted'
            }
            return Response(context , status=status.HTTP_200_OK)
        except:
            context = {
                'detail':'unable to delete user'
            }
            return Response(context , status=status.HTTP_403_FORBIDDEN)