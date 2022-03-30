# CHATLY

## Live Django + React Chat App

An asgi web app built using django(backend) , react(frontend) ,
django channels(asgi function) and django_rest_framework(API)

## FUNCTIONALITIES

## Account Creation And Login

A user can create an account and also login to view other users
![Sign Up](https://res.cloudinary.com/gamemojo/image/upload/v1646087426/chatly/readme/chatly_signup_xiueom.png)

![Login](https://res.cloudinary.com/gamemojo/image/upload/v1646087425/chatly/readme/chatly_login_ywppo4.png)

## Live Private Chat

A user can have a private conversion with others user

![Private chat](https://res.cloudinary.com/gamemojo/image/upload/v1646087425/chatly/readme/chatly_chat_dlrc9w.png)

## Follow and Unfollow

A user can follow other users and also unfollow them

![Users](https://res.cloudinary.com/gamemojo/image/upload/v1646087424/chatly/readme/chatly_users_schget.png)

## Remove Follower

A user can remove another user who follows them

## View Followers of others users

A user can also view followers of other users and follow or unfollow certain users they're already following

## Profile update and Profile image Update

This functioality is not totally complete yet , but a user can update/edit their profile picture  and their profile

![profile edit](https://res.cloudinary.com/gamemojo/image/upload/v1646087798/chatly/readme/chatly_profileEdit_im3sbp.png)

## Requirements to run the project
Postgresql 
Redis
Python

## How to start up project

After cloning the repo

Create a virtualenv with : `virtualenv venv`

cd into chatly folder : `cd chatly`

install requirements : `pip install -r requirements.txt`

set environment variables : Create a .env file in the base dir of chatly
and then set the env variables for `SECRET_KEY` `DATABASE_HOST`  `DATABASE_USER` `DATABASE_NAME` `DATABASE_PASSWORD`  `CLOUD_NAME` `API_SECRET` `API_KEY`

I used cloudinary to store media files , so you can get your `API_KEY` `API_SECRET` `CLOUD_NAME` from your cloudinary dashboard

Then `makemigrations` , `migrate` and `runserver`

