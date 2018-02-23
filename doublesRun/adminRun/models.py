# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class vendor(models.Model):
    Name = models.CharField(max_length=40)
    Description = models.CharField(max_length=200)
    locLat = models.DecimalField(max_digits=19, decimal_places=10)
    locLong = models.DecimalField(max_digits=19, decimal_places=10)
    pic = models.ImageField(upload_to=None, height_field=None, width_field=None, max_length=100)

    def __str__(self):
        return self.Name