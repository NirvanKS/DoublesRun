from .models import Vendor, User, Review
from django_cron import CronJobBase, Schedule
from django.db import models

class MyCronJob(CronJobBase):
#   RUN_EVERY_MINS = 120 # every 2 hours
    RUN_EVERY_MINS = 10080
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'adminRun.my_cron_job'    # a unique code

    def do(self):
        pass    # do your thing here
        print("CRONJAB FROM CRAGMAW")
        vendors = Vendor.objects.all()
        for vendor in vendors:
            vendor.baseTrending = vendor.threeStars + vendor.fourStars + vendor.fiveStars
            print(vendor.baseTrending)
            print("CRONJOB FINITO")
            vendor.save()
            
