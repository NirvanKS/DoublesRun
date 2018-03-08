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
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.name = navParams.get('vendorName');
    this.description = navParams.get('vendorDescription');
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorReviewPage');
  }

}
