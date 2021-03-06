import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddVendorIntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-vendor-intro',
  templateUrl: 'add-vendor-intro.html',
})
export class AddVendorIntroPage {

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  continue(){
    this.viewCtrl.dismiss();
  }

}
