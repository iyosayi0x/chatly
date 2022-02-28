from django.urls import path
from .views import CreateUserView , LoginUserView , ListUsersView , ToggleFollowView , FollowerCountView , ListFollowingView , LogoutUserView , GetCSRFToken , CheckAuthenticatedView , DeleteUserView , ListFollowersView , RemoveFollowerView

urlpatterns = [
    path('create_user/', CreateUserView.as_view()),
    path('login_user/', LoginUserView.as_view()),
    path('is_authenticated/', CheckAuthenticatedView.as_view()),
    path('list_users/',ListUsersView.as_view()),
    path('toggle_follow/', ToggleFollowView.as_view()),
    path('count_follow/',FollowerCountView.as_view()),
    path('list_following/',ListFollowingView.as_view()),
    path('list_followers/',ListFollowersView.as_view()),
    path('remove_follower/',RemoveFollowerView.as_view()),
    path('logout_user/', LogoutUserView.as_view()),
    path('getcsrf_cookie/', GetCSRFToken.as_view()),
    path('delete_user/', DeleteUserView.as_view())
]