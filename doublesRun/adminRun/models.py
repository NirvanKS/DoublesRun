# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import uuid


# Create your models here.
class Vendor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid1, editable=False)
    Name = models.CharField(max_length=40)
    Description = models.CharField(max_length=200)
    locLat = models.DecimalField(max_digits=25, decimal_places=20)
    locLong = models.DecimalField(max_digits=25, decimal_places=20)
    pic = models.CharField(max_length=1000000)
    Type = models.BooleanField()

    def __str__(self):
        return self.Name