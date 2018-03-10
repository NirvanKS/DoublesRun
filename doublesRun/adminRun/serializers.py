from .models import Vendor
from rest_framework import serializers

class VendorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Vendor
        fields = ('Name', 'Description', 'locLat', 'locLong','pic', 'Type')