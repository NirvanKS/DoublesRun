# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import uuid
from django.contrib.postgres.fields import ArrayField


# Create your models here.
class Vendor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid1, editable=False)
    Name = models.CharField(max_length=40)
    Description = models.CharField(max_length=200)
    locLat = models.DecimalField(max_digits=25, decimal_places=20)
    locLong = models.DecimalField(max_digits=25, decimal_places=20)
    pic = models.CharField(max_length=1000000)
    Type = models.BooleanField()
    avgRating = models.DecimalField(max_digits=2 ,decimal_places=1, default=0.0)
    avgThickness = models.DecimalField(max_digits =3, decimal_places=1,default=0.0)
    avgTime = models.DecimalField(max_digits =3,decimal_places=1,default=0.0)
    avgCucumber = models.DecimalField(max_digits =3,decimal_places=1,default=0.0)
    avgSpicy = models.DecimalField(max_digits =3,decimal_places=1, default=0.0)
    reviews = ArrayField(models.CharField(max_length=50, blank=True, default="a"),default= list,blank=True)

    def __str__(self):
        return self.Name

    
def defaultArray(self):
        return []

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid1, editable=False)
    name = models.CharField(max_length=40)
    email = models.CharField(max_length=50)
    reviews = ArrayField(models.CharField(max_length=50, blank=True, default="a"),default= list,blank=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid1, editable=False)
    rating = models.IntegerField(default=0)
    spicy = models.IntegerField(default=0,null=True, blank=True)
    thickness = models.IntegerField(default=0,null=True, blank=True)
    time = models.IntegerField(default=0)
    comment = models.CharField(max_length=240,blank=True)
    vendorID = models.UUIDField(default=uuid.uuid1)
    userID =  models.UUIDField(default=uuid.uuid1)
    cucumber = models.NullBooleanField(null=True, blank=True)

    def __str__(self):
        return str(self.id)
