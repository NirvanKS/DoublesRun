# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-05 01:23
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adminRun', '0005_auto_20180404_2209'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vendor',
            name='negativeReviews',
        ),
        migrations.RemoveField(
            model_name='vendor',
            name='positiveReviews',
        ),
        migrations.RemoveField(
            model_name='vendor',
            name='rankingScore',
        ),
    ]