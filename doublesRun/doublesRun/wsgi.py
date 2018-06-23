"""
WSGI config for doublesRun project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/
"""

import os
sys.path.append('/opt/bitnami/apps/django/django_projects/doublesRun')
os.environ.setdefault("PYTHON_EGG_CACHE", "/opt/bitnami/apps/django/django_projects/doublesRun/egg_cache")
from django.core.wsgi import get_wsgi_application
from whitenoise.django import DjangoWhiteNoise

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "doublesRun.settings")

application = get_wsgi_application()
application = DjangoWhiteNoise(application)