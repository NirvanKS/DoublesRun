from .models import Vendor
from rest_framework import serializers

class VendorSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = Vendor
        fields = ('id','Name', 'Description', 'locLat', 'locLong','pic', 'Type')
