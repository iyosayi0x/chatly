# Generated by Django 4.0.2 on 2022-02-23 12:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0006_chatthreadmanager'),
    ]

    operations = [
        migrations.DeleteModel(
            name='ChatThreadManager',
        ),
    ]
