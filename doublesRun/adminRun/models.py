# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db.models.signals import post_save
from django.db.models import signals
from django.dispatch import receiver
from django.db.models import F
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
    pic = models.CharField(max_length=1000000, blank = True)
    Type = models.BooleanField()
    avgRating = models.DecimalField(max_digits=2 ,decimal_places=1, default=0.0)
    avgThickness = models.DecimalField(max_digits =3, decimal_places=1,default=0.0)
    avgTime = models.DecimalField(max_digits =3,decimal_places=1,default=0.0)
    avgCucumber = models.NullBooleanField(null=True, blank=True)
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



@receiver(signals.post_save, sender=Review)
def my_handler(sender,instance,**kwargs):
    reviews = Review.objects.filter(vendorID = instance.vendorID)
    ratingSum = 0
    spicySum = 0
    thickSum = 0
    timeSum = 0
    cucumberSum = 0
    cucumberYes = 0
    cucumberNo = 0
    
    for review in reviews:
        ratingSum = ratingSum + review.rating
        spicySum = spicySum + review.spicy
        thickSum = thickSum + review.thickness
        timeSum = timeSum + review.time
        if(review.cucumber==True):
            cucumberYes = cucumberYes + 1
        else:
            cucumberNo = cucumberNo + 1
        #cucumberSum = cucumberSum + review.cucumber
    cucumberAvail = False
    if(cucumberYes >= cucumberNo):
        cucumberAvail = True
    else:
        cucumberAvail = False
    numberReviews = len(reviews)
    avg_Rating = ratingSum/ numberReviews
    avg_Spicy = spicySum / numberReviews
    avg_Thick = thickSum/ numberReviews
    avg_Time = timeSum/ numberReviews
    avg_Cucumber = cucumberAvail
    vendor = Vendor.objects.get(id=instance.vendorID)
    #vendor.avgRating = avg_Rating
    vendor.avgRating = avg_Rating
    #vendor.save(update_fields= ["avgRating"])

    vendor.avgSpicy = avg_Spicy
    vendor.avgThickness = avg_Thick
    vendor.avgTime = avg_Time
    vendor.avgCucumber = avg_Cucumber
    vendor.reviews.append(instance.id)
    vendor.save()
    

    #user = User.objects.all.filter(id = instance.userID)
    #user.reviews.append(instance.id)
    #user.save()

 
    
    
