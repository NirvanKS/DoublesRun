import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VendorReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-review',
  templateUrl: 'vendor-review.html',
})
export class VendorReviewPage {
  name: String;
  description: String;
  type: boolean;
  review = {
    rating: 0,
    thickness: 0,
    spicy: 0,
    topping: "n",
    time: 0,
    comment: ""

  }
  NonReview = {
    Nrating:0,
    time: 0,
    Ncomment: ""
  }
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.name = navParams.get('vendorName');
    this.description = navParams.get('vendorDescription');
    this.type = navParams.get('vendorType');
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorReviewPage');
  }

  logReview(form){
    var d = new Date();
    this.review.time = d.getHours();
    console.log(this.review);
  }

  logNonReview(form){
    var d = new Date();
    this.NonReview.time = d.getHours();
    console.log(this.NonReview);
  }

}
