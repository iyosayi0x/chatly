from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Message , ChatThread
from rest_framework import status
from .serializers import MessageSerializer
from rest_framework.response import Response
from django.db.models import Q


class FetchMessagesView(APIView):
    def post(self , request):
        data = request.data
        sender = request.user
        if (sender.is_authenticated):
            try :
                #confirming if the receiver of this message actuall exists
                receiver = User.objects.get(username__iexact=data['receiver'])
                messages = Message.objects.fetch_messages(sender , receiver)
                context = {
                    "receiver_id":receiver.id,
                    "data":[
                        {
                            "id":message.id,
                            "year":message.time_stamp.year,
                            "month":message.time_stamp.month,
                            "day":message.time_stamp.day,
                            "time":{"hours":message.time_stamp.time().hour,
                                    "mins":message.time_stamp.time().minute,
                                },
                            "description":message.description,
                            "sender":message.sender.id,
                            "receiver":message.receiver.id
                        } for message in messages
                    ]
                }
                # check if both users have a previous chat thread
                chat_thread = ChatThread.objects.get_thread(sender, receiver)
                if len(chat_thread) == 0 :
                    new_message = Message.objects.create(sender=sender , receiver=receiver)
                    ChatThread.objects.create(first_user=sender , second_user=receiver , message=new_message)
                return Response(context, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                context = {
                    "error":"User does not exist"
                }
                return Response(context)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class FetchChatThreadView(APIView):
    def get(self , request):
        user = request.user
        first_lookup = Q(first_user=user)
        second_lookup = Q(second_user=user)
        third_lookup = (~Q(message__description =''))
        queryset = ChatThread.objects.filter((first_lookup | second_lookup) & third_lookup).order_by("-message__time_stamp")
        serializer = [
            {
                "id":thread.id,
                "seen":thread.seen,
                "first_user":{
                    "name":f"{thread.first_user.username}",
                    "id":thread.first_user.id
                    },
                "second_user":{
                    "name":f"{thread.second_user.username}",
                    "id":thread.second_user.id
                    },
                "message":thread.message.description,
                "time_stamp":thread.time_stamp
            } for thread in queryset
        ]
        # adding the ids of all the users the use has ever sent a message to , to a list
        ids = [chatthread.first_user.id if chatthread.first_user.id != user.id else
                chatthread.second_user.id for chatthread in queryset
                ]
        context = {
                "ids":f"{ids}",
                "data":serializer
            }
        return Response(context ,status=status.HTTP_200_OK)

    def post(self , request):
        data = request.data
        user = request.user
        receiver = data['receiver']
        try:
            receiver = User.objects.get(username__iexact=receiver)
            first_lookup = Q(first_user=user, second_user=receiver)
            second_lookup = Q(first_user=receiver , second_user=user)
            queryset = ChatThread.objects.filter(first_lookup | second_lookup).order_by('time_stamp')[0]
            serializer = [
                {
                    "id":thread.id,
                    "seen":thread.seen,
                    "first_user":{
                        "name":f"{thread.first_user.username}",
                        "id":f"{thread.first_user.id}"
                        },
                    "second_user":{
                        "name":f"{thread.second_user.username}",
                        "id":f"{thread.second_user.id}"
                        },
                    "message":thread.message.description
                } for thread in queryset
            ]
            return Response(serializer, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            context = {
                "error": "User does not exist"
            }
            return Response(context)

