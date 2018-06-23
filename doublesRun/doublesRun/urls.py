"""doublesRun URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from django.urls import path, include, re_path
from adminRun import views

from django.views.static import serve

router = routers.DefaultRouter()
router.register(r'vendors', views.VendorViewSet)
router.register(r'users',views.UserViewSet)
router.register(r'reviews',views.ReviewViewSet)


urlpatterns = [
    re_path(r'^admin/', admin.site.urls),

    re_path(r'^', include(router.urls)), #remove line when disabling browsable api
    re_path(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path(r'^static/(?P<path>.*)$', serve, {
            'document_root': settings.STATIC_ROOT,
        }),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 
