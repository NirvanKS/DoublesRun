import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapPage } from '../../pages/map/map';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/*
  Generated class for the SnapToMapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SnapToMapProvider {
  myLatParam: number; //vendor geolocation
  myLongParam: number;
  shouldIBeVendorSnappo = false;
  constructor(public navCtrl: NavController) {
    console.log('Hello SnapToMapProvider Provider');
  }

  goToVendor(geoLat: number, geoLong: number) {
    this.myLatParam = geoLat;
    this.myLongParam = geoLong;
    this.shouldIBeVendorSnappo = true;
    this.navCtrl.push(MapPage, { 'myLongParam': this.myLongParam, 'myLatParam': this.myLatParam });
  }

}
