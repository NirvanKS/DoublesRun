# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-03-11 00:53
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('adminRun', '0009_auto_20180310_2051'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vendor',
            name='id',
            field=models.UUIDField(default=uuid.uuid1, editable=False, primary_key=True, serialize=False),
        ),
    ]