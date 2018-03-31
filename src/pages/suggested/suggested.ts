import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login'
import { SnapToMapProvider } from '../../providers/snap-to-map/snap-to-map'
/**
 * Generated class for the SuggestedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-suggested',
  templateUrl: 'suggested.html',
})
export class SuggestedPage {
  isLoggedIn: boolean = false;
  loggedUser: any;
  displayName: any;
  email: any;
  familyName: any;
  givenName: any;
  userId: any;
  imageUrl: any;

  geoLat: number;
  geoLong: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loginProvider: LoginProvider, public snaptomap: SnapToMapProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuggestedPage');
  }

  async login() {
    await this.loginProvider.login();
    console.log(this.loginProvider.displayName);
    this.displayName = this.loginProvider.displayName;
    this.email = this.loginProvider.email;
    this.familyName = this.loginProvider.familyName;
    this.givenName = this.loginProvider.givenName;
    this.userId = this.loginProvider.userId;
    this.imageUrl = this.loginProvider.imageUrl;
    this.isLoggedIn = this.loginProvider.isLoggedIn;
    console.log(this.isLoggedIn);
  }

  async logout() {
    await this.loginProvider.logout();
  }

  snapVendorToMap() {
    // returns geoLat: number, geoLong: number
    this.snaptomap.goToVendor(this.geoLat, this.geoLong);
  }


}
