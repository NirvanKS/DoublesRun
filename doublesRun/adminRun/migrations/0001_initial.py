# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-02-23 01:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='vendor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Name', models.CharField(max_length=40)),
                ('Description', models.CharField(max_length=200)),
                ('locLat', models.DecimalField(decimal_places=10, max_digits=19)),
                ('locLong', models.DecimalField(decimal_places=10, max_digits=19)),
                ('pic', models.ImageField(upload_to=None)),
            ],
        ),
    ]
