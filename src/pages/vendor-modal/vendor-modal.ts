import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { VendorReviewPage } from '../vendor-review/vendor-review';

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
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.name = navParams.get('name');
    this.description = navParams.get('description');
    this.type = navParams.get('type');
    //this.description = navParams.get('description');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  loadReviewPage(){
    this.navCtrl.push(VendorReviewPage, {
      vendorName : this.name,
      vendorDescription: this.description,
      vendorType: this.type
    });
  }

}
