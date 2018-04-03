import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FilterListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter-list',
  templateUrl: 'filter-list.html',
})
export class FilterListPage {
  vendorList: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.vendorList = navParams.get('vendors');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterListPage');
  }

  openVendor(v){
    console.log("This vendor's Latitidue is: " + v.locLat);
    console.log("This vendor's Longitude is: " + v.locLong);
    //Call Nirvan's Service here with the longitude and latitude
  }



}
