# Generated by Django 2.0.2 on 2018-03-03 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adminRun', '0003_auto_20180303_1631'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vendor',
            name='locLat',
            field=models.DecimalField(decimal_places=25, max_digits=25),
        ),
        migrations.AlterField(
            model_name='vendor',
            name='locLong',
            field=models.DecimalField(decimal_places=25, max_digits=25),
        ),
    ]