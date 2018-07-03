# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Vendor
from .models import Review
from .models import User

admin.site.register(Vendor)
admin.site.register(Review)
admin.site.register(User)
