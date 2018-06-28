from .models import Vendor, User, Review
from rest_framework import serializers

class VendorSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = Vendor
        fields = ('id','Name', 'Description', 'locLat', 'locLong','pic', 'Type','avgRating', 'avgThickness', 'avgTime', 'avgCucumber','avgSpicy','reviews','positiveReviews','negativeReviews','oneStars','twoStars','threeStars','fourStars','fiveStars', 'rankingScore','reportCount','baseTrending')
#'avgRating', 'avgThickness', 'avgTime','avgCucmber','avgSpicy','reviews

class UserSerializer(serializers.HyperlinkedModelSerializer):
    # id = serializers.ReadOnlyField()
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'reviews','suggestions')

class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = Review
        fields = ('id', 'rating', 'spicy', 'thickness', 'time', 'comment', 'vendorID', 'userID', 'cucumber')
    
    def create(self, validated_data):
        return Review.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.id = validated_data.get('id', instance.id)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.spicy = validated_data.get('spicy', instance.spicy)
        instance.thickness = validated_data.get('thickness', instance.thickness)
        instance.time = validated_data.get('time', instance.time)
        instance.comment = validated_data.get('comment',instance.comment)
        instance.vendorID = validated_data.get('vendorID',instance.vendorID)
        isntance.userID = validated_data.get('userID',instance.userID)
        instance.cucumber = validated_data.get('cucumber', instance.cucumber)
        instance.save()
        return instance