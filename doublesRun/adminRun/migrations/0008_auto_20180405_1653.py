# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-05 19:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adminRun', '0007_auto_20180404_2239'),
    ]

    operations = [
        migrations.AddField(
            model_name='vendor',
            name='fiveStars',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='vendor',
            name='fourStars',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='vendor',
            name='oneStars',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='vendor',
            name='threeStars',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='vendor',
            name='twoStars',
            field=models.IntegerField(default=0),
        ),
    ]
