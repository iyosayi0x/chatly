import json
from channels.consumer import AsyncConsumer
from .models import Message , ChatThread
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.contrib.auth.models import User
from .thread import GetChatThread

class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self , event):
        receiver = self.scope['url_route']['kwargs']['username']
        self.sender = self.scope['user']

        self.receiver_user= await self.get_user(username=receiver)
        thread = await self.get_chat_thread()
        chat_id = f"chat_{thread.id}"
        self.chat_id = chat_id
        await self.channel_layer.group_add(
            self.chat_id,
            self.channel_name
        )
        await self.send({
            "type":"websocket.accept"
        })

    async def websocket_receive(self , event):
        text = event.get('text',None)
        if text is not None:
            data = json.loads(text)
            message_description = data.get("message_description")
            receiverId = data.get("receiverId")
            senderId = data.get("senderId")
            res = {
                "message_description":message_description,
                "receiverId":receiverId,
                "senderId":senderId
                }

            # create the message and updates the thread
            await self.create_message_and_update_thread(description=message_description)

            await self.channel_layer.group_send(
                self.chat_id,
                {
                    "type":"chat_message_event",
                    "text":json.dumps(res)
                }
            )

    async def websocket_disconnect(self , event):
        print('disconnect',event)

    async def chat_message_event(self , event):
        await self.send ({
            "type":"websocket.send",
            "text":event['text']
        })

    @database_sync_to_async
    def get_chat_thread(self):
        thread = GetChatThread(self.sender,self.receiver_user)
        thread.start()
        query = thread.join()[0]
        return query

    @database_sync_to_async
    def get_user(self,username):
        return User.objects.get(username__iexact=username)

    @database_sync_to_async
    def create_message_and_update_thread(self,description):
        # sendign a message
        # sender is the current logged in user
        message = Message.objects.create(sender = self.sender , receiver=self.receiver_user,description=description)
        # create the new chat thread
        ChatThread.objects.create(first_user=self.sender , second_user=self.receiver_user , message=message)




