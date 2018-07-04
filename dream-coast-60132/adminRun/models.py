# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db.models.signals import post_save
from django.db.models import signals
from django.dispatch import receiver
from django.db.models import F
from django.db import models
import uuid
from django.contrib.postgres.fields import ArrayField
from surprise import SVD
from surprise.model_selection import cross_validate
from surprise import Reader, Dataset, evaluate
from django.conf import settings
from math import sqrt



# Create your models here.
class Vendor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid1, editable=False)
    Name = models.CharField(max_length=40)
    Description = models.CharField(max_length=200)
    locLat = models.DecimalField(max_digits=25, decimal_places=20)
    locLong = models.DecimalField(max_digits=25, decimal_places=20)
    pic = models.CharField(max_length=1000000, blank = True)
    Type = models.BooleanField()
    avgRating = models.DecimalField(max_digits=2 ,decimal_places=1, default=0.0)
    avgThickness = models.DecimalField(max_digits =3, decimal_places=1,default=0.0)
    avgTime = models.DecimalField(max_digits =3,decimal_places=1,default=0.0)
    avgCucumber = models.NullBooleanField(null=True, blank=True)
    avgSpicy = models.DecimalField(max_digits =3,decimal_places=1, default=0.0)
    avgChanna = models.DecimalField(max_digits =3,decimal_places=1, default=0.0)
    reviews = ArrayField(models.CharField(max_length=50, blank=True, default="a"),default= list,blank=True)
    positiveReviews = models.IntegerField(default=0)
    negativeReviews = models.IntegerField(default=0)
    oneStars = models.IntegerField(default=0)
    twoStars = models.IntegerField(default=0)
    threeStars = models.IntegerField(default=0)
    fourStars = models.IntegerField(default=0)
    fiveStars = models.IntegerField(default=0)
    rankingScore = models.FloatField(default=0.0)
    reportCount = models.IntegerField(default = 0)
    baseTrending = models.FloatField(default=0.0)

    def __str__(self):
        return self.Name

    
def defaultArray(self):
        return []

class User(models.Model):
    # id = models.UUIDField(primary_key=True, default=uuid.uuid1, editable=False)
    id = models.CharField(primary_key=True, max_length=40)
    name = models.CharField(max_length=40)
    email = models.CharField(max_length=50)
    suggestions = ArrayField(models.CharField(max_length=50, blank=True), default=list,blank=True)
    reviews = ArrayField(models.CharField(max_length=50, blank=True, default="a"),default= list,blank=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid1, editable=False)
    rating = models.IntegerField(default=0)
    spicy = models.IntegerField(default=0,null=True, blank=True)
    thickness = models.IntegerField(default=0,null=True, blank=True)
    channa = models.IntegerField(default=0,null=True, blank=True)
    time = models.IntegerField(default=0)
    comment = models.CharField(max_length=240,blank=True)
    vendorID = models.UUIDField(default=uuid.uuid1)
    userID = models.CharField(max_length=40)
    cucumber = models.NullBooleanField(null=True, blank=True)

    def __str__(self):
        return str(self.id)



@receiver(signals.post_save, sender=Review)
def my_handler(sender,instance,**kwargs):
    reviews = Review.objects.filter(vendorID = instance.vendorID)
    #print(reviews)
    ratingSum = 0
    spicySum = 0
    thickSum = 0
    timeSum = 0
    cucumberSum = 0
    channaSum = 0
    cucumberYes = 0
    cucumberNo = 0
    triggerSVD = 1
    
    for review in reviews:
        print( "=>>>>>>>>>>>>>>>sdlansidnaisndaisndiansd ",review.spicy,review.thickness,review.time,review.vendorID)
        ratingSum = ratingSum + review.rating
        spicySum = spicySum + review.spicy
        thickSum = thickSum + review.thickness
        timeSum = timeSum + review.time
        channaSum = channaSum + review.channa
        if(review.cucumber==True):
            cucumberYes = cucumberYes + 1
        else:
            cucumberNo = cucumberNo + 1
        #cucumberSum = cucumberSum + review.cucumber
    cucumberAvail = False
    if(cucumberYes >= cucumberNo):
        cucumberAvail = True
    else:
        cucumberAvail = False
    numberReviews = len(reviews)
    avg_Rating = ratingSum/ numberReviews
    avg_Spicy = spicySum / numberReviews
    avg_Thick = thickSum/ numberReviews
    avg_Time = timeSum/ numberReviews
    avg_channa = channaSum/numberReviews
    avg_Cucumber = cucumberAvail
    vendor = Vendor.objects.get(id=instance.vendorID)
    #vendor.avgRating = avg_Rating
    vendor.avgRating = avg_Rating
    #vendor.save(update_fields= ["avgRating"])
    
    numOnes = vendor.oneStars
    numTwos = vendor.twoStars
    numThrees = vendor.threeStars
    numFours = vendor.fourStars
    numFives = vendor.fiveStars

    
    if(instance.rating==1):
        numOnes+=1
    elif(instance.rating==2):
        numTwos+=1
    elif(instance.rating==3):
        numThrees+=1
    elif(instance.rating==4):
        numFours+=1
    elif(instance.rating==5):
        numFives+=1
    
    avgNumRatings = 1*numOnes + 2*numTwos + 3*numThrees + 4*numFours + 5*numFives
    totalRatings = numOnes + numTwos + numThrees + numFours + numFives
    xBar = avgNumRatings/totalRatings
    xBar = (xBar-1)/4
    z = 1.96
    lowerBound = (xBar + z*z/(2*totalRatings) - z * sqrt((xBar*(1-xBar)+z*z/(4*totalRatings))/totalRatings))/(1+z*z/totalRatings)
    answer = (1 + 4*lowerBound)
    vendor.rankingScore = answer
    vendor.oneStars = numOnes
    vendor.twoStars = numTwos
    vendor.threeStars = numThrees
    vendor.fourStars = numFours
    vendor.fiveStars = numFives
   # positive = vendor.positiveReviews + 1
   # negative = vendor.negativeReviews + 1
    
   # n = positive + negative
    '''
    if (n==0):
        vendor.positiveReviews = vendor.positiveReviews + 1
        vendor.negativeReviews = vendor.negativeReviews + 1
        vendor.rankingScore = 0
    else:
        '''
   # z = 1.96
   # phat = float(positive)/n
   # lowerBound = (phat + z*z/(2*n) - z * sqrt((phat*(1-phat)+z*z/(4*n))/n))/(1+z*z/n)
   # if(instance.rating >=3):
   #     vendor.positiveReviews = positive
   # else:
   #     vendor.negativeReviews = negative
   # vendor.rankingScore = lowerBound * 100.0
        

    vendor.avgSpicy = avg_Spicy
    vendor.avgThickness = avg_Thick
    vendor.avgTime = avg_Time
    vendor.avgCucumber = avg_Cucumber
    vendor.avgChanna = avg_channa
    flag = True
    for r in vendor.reviews:
        # print("false", instance.id, r)
        if (str(instance.id)==str(r)):
            # print("false", instance.id, r)
            flag = False
            linesOfReviews = []
            with open(settings.STATIC_ROOT+'/u.data', 'w+') as f:
                line = f.readline()
                print(line)
                while line:
                    if(instance.userID not in line and instance.vendorID not in line):
                        linesOfReviews.append(line)
                        print("YAHOOOOOO - ", line)
                    line= f.readline()
                f.writelines(linesOfReviews)
    
    if flag:
        vendor.reviews.append(instance.id)
        vendor.save()
    

    user = User.objects.get(id = instance.userID)
    flag = True
    for r in user.reviews:
        if (str(instance.id)==str(r)):
            flag = False
    
    if flag:
        user.reviews.append(instance.id)
        user.save()

    userReviews = Review.objects.filter(userID= instance.userID)

    with open(settings.STATIC_ROOT+'/u.data', 'a+') as f:
        reviewRating  = str(instance.rating)
        vendorReviewed = str(instance.vendorID)
        f.write(instance.userID +"\t"+ vendorReviewed +"\t"+ reviewRating +"\n")
    rev = Review.objects.all()
    if(len(rev)%triggerSVD ==0):
        reader = Reader(line_format='user item rating', sep='\t')
     #   data = Dataset.load_from_file('.static/ml-100k/u.data', reader=reader)
        data = Dataset.load_from_file(settings.STATIC_ROOT+'/u.data', reader=reader)
        algo = SVD()
        trainset = data.build_full_trainset()
        print("TRAINSETTTT:",trainset)
        # trainset, testset = train_test_split(data, test_size=.25)
        algo.fit(trainset)
        # p = algo.test(testset)
        p = algo.predict("117828282232280081254","c0c37e8c-3169-11e8-948b-5a6176fb166f")
        print("AHHHHHHHHHHHHHHHHHHHHHHHH;",p)
        # e = evaluate(algo, data, measures=['RMSE', 'MAE'])
        print("eval: HERE::::::::: ")
        # cross_validate(algo, data, measures=['RMSE', 'MAE'], cv=5, verbose=True)
        from collections import defaultdict

        antiTestSet = trainset.build_anti_testset()
        print("ANTITESTSETT: ",antiTestSet)
        predictions = algo.test(antiTestSet)
        print("Predictiosssssssss:",predictions)

        def get_top3_recommendations(predictions, topN = 3):
            top_recs = defaultdict(list)
            for userID, vendorID, true_r, est, _ in predictions:
                top_recs[userID].append((vendorID, est))

            for userID, user_ratings in top_recs.items():
                user_ratings.sort(key = lambda x: x[1], reverse = True)
                top_recs[userID] = user_ratings[:topN]

            return top_recs
        myRecs = get_top3_recommendations(predictions, 3)
        
        #for u in User.objects.all():
        allUsers = User.objects.values_list('id',flat=True)
        userSuggestList = []
        for uid, user_ratings in myRecs.items():
            userSuggestList.append(uid)
            u = User.objects.get(id = uid)
            u.suggestions = []
            print(uid,  user_ratings)
            for iid, est in user_ratings:
                print(iid)
                u.suggestions.append(iid)
            u.save()

        noSuggestList = list(set(allUsers) - set(userSuggestList))

        for element in noSuggestList:
            userElement = User.objects.get(id = element)
            userElement.suggestions = []
            userElement.save()

        
           # u.suggestions.append

            #v = myRecs[u.id].items()
            #for userID, vendorID, true_r, est, _ in v:
                #u.suggestions.append(vendorID)
            print("HEEEEEEEEEEEEEERE: ", myRecs.items())

        print(myRecs.keys())
        #smallChange
        #smallerChange
        #smallestChange

    @receiver(signals.pre_delete, sender=Review)
    def editReview_handler(sender,instance,**kwargs):
        linesOfReviews = []
        with open(settings.STATIC_ROOT+'/u.data', 'w+') as f:
            line = f.readline()
            print(line)
            while line:
                if(instance.userID not in line and instance.vendorID not in line):
                    linesOfReviews.append(line)
                    print("YAHOOOOOO - ", line)
                line= f.readline()
            f.writelines(linesOfReviews)

   
    

 
    
    
