# Generated by Django 2.0.2 on 2018-03-12 01:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adminRun', '0008_auto_20180311_2200'),
    ]

    operations = [
        migrations.RenameField(
            model_name='vendor',
            old_name='v_id',
            new_name='id',
        ),
    ]