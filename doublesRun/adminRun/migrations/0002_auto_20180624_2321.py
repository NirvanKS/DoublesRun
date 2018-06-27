# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-06-25 03:21
from __future__ import unicode_literals

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adminRun', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='vendor',
            name='baseTrending',
            field=models.FloatField(default=0.0),
        ),

        migrations.AddField(
            model_name='vendor',
            name='reportCount',
            field=models.IntegerField(default=0),
        ),
    ]