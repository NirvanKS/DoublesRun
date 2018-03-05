import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.name = navParams.get('name');
    this.description = navParams.get('description');
    //this.description = navParams.get('description');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
