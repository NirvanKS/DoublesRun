from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Vendor, User, Review


@receiver(post_save, sender=Review)
def my_handler(sender,instance,**kwargs):
    reviews = Review.objects.all.filter(vendorID = instance.vendorID)
    
