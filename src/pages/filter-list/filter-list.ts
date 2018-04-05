import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SnapToMapProvider } from '../../providers/snap-to-map/snap-to-map'
import { MapPage } from '../map/map'
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public snaptomap: SnapToMapProvider) {
    this.vendorList = navParams.get('vendors');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterListPage');
  }

  openVendor(v) {
    console.log("This vendor's Latitidue is: " + v.locLat);
    console.log("This vendor's Longitude is: " + v.locLong);
    this.snaptomap.goToVendor(v.locLat, v.locLong);
    this.navCtrl.parent.select(1);
    //this.navCtrl.push(MapPage);
    //Call Nirvan's Service here with the longitude and latitude
  }



}
