import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { SnapToMapProvider } from '../../providers/snap-to-map/snap-to-map';
import { CacheService } from 'ionic-cache';
import { Http, Headers } from '@angular/http';
import { TabsPage } from '../tabs/tabs';
import { ThemeSettingsProvider } from '../../providers/theme-settings/theme-settings';

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
  public ionicNamedColor: string = 'danger';
  isLoggedIn: boolean= this.loginProvider.isLoggedIn;
  loggedUser: any;
  displayName: any= this.loginProvider.displayName;
  email: any= this.loginProvider.email;
  familyName: any= this.loginProvider.familyName;
  givenName: any= this.loginProvider.givenName;
  userId: any= this.loginProvider.userId;
  imageUrl: any= this.loginProvider.imageUrl;
  suggestions:any= this.loginProvider.suggestions;
  suggVendors: any = this.loginProvider.suggVendors;
  cachedVendors: any;
  tabsPage:any = TabsPage;

  geoLat: number;
  geoLong: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public loginProvider: LoginProvider, public snaptomap: SnapToMapProvider, 
    private cache: CacheService, public http: Http, public settings: ThemeSettingsProvider) {
    if (this.settings.isDark == true) {
      this.ionicNamedColor = 'light';
    }
  }

  ionViewDidLoad() {
  }
  ionViewWillEnter(){
  }
  async login() {
    await this.loginProvider.login();
    this.displayName = this.loginProvider.displayName;
    this.email = this.loginProvider.email;
    this.familyName = this.loginProvider.familyName;
    this.givenName = this.loginProvider.givenName;
    this.userId = this.loginProvider.userId;
    this.imageUrl = this.loginProvider.imageUrl;
    this.isLoggedIn = this.loginProvider.isLoggedIn;
    this.suggestions = this.loginProvider.suggestions;
    this.suggVendors= this.loginProvider.suggVendors;
    
  }

  async logout() {
    await this.loginProvider.logout();
  }

  snapVendorToMap(v) {
    this.snaptomap.goToVendor(v.locLat, v.locLong);
    this.navCtrl.setRoot(this.tabsPage, {tabIndex: 1});
  }


}
