# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-05 01:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adminRun', '0006_auto_20180404_2223'),
    ]

    operations = [
        migrations.AddField(
            model_name='vendor',
            name='negativeReviews',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='vendor',
            name='positiveReviews',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='vendor',
            name='rankingScore',
            field=models.FloatField(default=0.0),
        ),
    ]