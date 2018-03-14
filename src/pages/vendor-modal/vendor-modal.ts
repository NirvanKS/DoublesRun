import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { VendorReviewPage } from '../vendor-review/vendor-review';
import { Http, Headers } from '@angular/http';

/**
 * Generated class for the VendorModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-modal',
  templateUrl: 'vendor-modal.html',
})
export class VendorModalPage {
  name: string;
  description: string;
  type: boolean;
  ratings:any =[];
  comments:any=[];
  

  avgRating: Number;
  avgThickness: Number;
  avgTime: Number;
  avgCucumber: boolean; 
  avgSpicy: Number;
  revList: any;
  reviews: any;
  vendorID: any;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
    private http: Http, public navParams: NavParams) {

    this.name = navParams.get('name');
    this.description = navParams.get('description');
    this.type = navParams.get('type');
    this.revList = navParams.get('reviewList');
    this.avgRating = navParams.get('avgRating'); this.avgCucumber = navParams.get('avgCucumber');
    this.avgThickness = navParams.get('avgThickness'); this.avgSpicy = navParams.get('avgSpicy');
    this.avgTime = navParams.get('avgTime');
    this.vendorID = navParams.get('vendorID');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorModalPage');
    console.log(this.revList[this.revList.length-1]);
    this.loadSomeReviews();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  loadReviewPage(){
    this.navCtrl.push(VendorReviewPage, {
      vendorName : this.name,
      vendorDescription: this.description,
      vendorType: this.type,
      vendorID: this.vendorID
    });
  }

  loadSomeReviews(){
    for(var i=this.revList.length-1; i>this.revList.length-6;i--){
      if (i<0) break;
      this.http.get('http://127.0.0.1:8000/reviews/'+this.revList[i]+'/')
        .map(res => res.json())
        .subscribe((data: Object) => {
          this.reviews = Object.values(data);
          this.ratings.push(this.reviews[1]);
          this.comments.push(this.reviews[5]);
          console.log(this.reviews[1]);
        })
    }
  }

}
