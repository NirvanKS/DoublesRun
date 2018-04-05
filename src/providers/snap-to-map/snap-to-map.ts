import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapPage } from '../../pages/map/map';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Inject, ViewChild } from '@angular/core';
/*
  Generated class for the SnapToMapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SnapToMapProvider {
  @ViewChild('nav') nav: NavController;
  myLatParam: number; //vendor geolocation
  myLongParam: number;
  shouldIBeVendorSnappo = false;
  constructor() {
    console.log('Hello SnapToMapProvider Provider');
  }

  goToVendor(geoLat: number, geoLong: number) {
    this.myLatParam = geoLat;
    this.myLongParam = geoLong;
    this.shouldIBeVendorSnappo = true;
  }

}
