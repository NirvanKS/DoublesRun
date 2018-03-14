from .models import Vendor, User, Review
from rest_framework import serializers

class VendorSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = Vendor
        fields = ('id','Name', 'Description', 'locLat', 'locLong','pic', 'Type','avgRating', 'avgThickness', 'avgTime', 'avgCucumber','avgSpicy','reviews')
#'avgRating', 'avgThickness', 'avgTime','avgCucmber','avgSpicy','reviews

class UserSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'reviews')

class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = Review
        fields = ('id', 'rating', 'spicy', 'thickness', 'time', 'comment', 'vendorID', 'userID', 'cucumber')