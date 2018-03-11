# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
from .models import Vendor, User, Review
from rest_framework import viewsets
from .serializers import VendorSerializer, UserSerializer, ReviewSerializer


class VendorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = ReviewSerializer
