import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FilterListPage } from '../filter-list/filter-list';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CacheService } from 'ionic-cache';
import { ThemeSettingsProvider } from '../../providers/theme-settings/theme-settings'
/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  selectedTheme: String;
  public ionicNamedColor: string = 'danger';
  nightMode = false;
  apiUrl = "https://intense-dolphin-207823.appspot.com/";
  vendors: any;
  highRated: boolean = false;
  thick: boolean = false;
  thin: boolean = false;
  cucumber: boolean = false;
  spicy: boolean = false;
  cachedVendors: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private cache: CacheService, public settings: ThemeSettingsProvider) {
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val;
      console.log("filter component " + this.selectedTheme);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
  }

  enableNight() {
    console.log("enabling night" + this.nightMode);
    this.settings.isDark = this.nightMode;
    // if (this.nightMode) this.settings.setActiveTheme('dark-theme');
    // else this.settings.setActiveTheme('light-theme');
    if (this.selectedTheme === 'dark-theme') {
      this.settings.setActiveTheme('light-theme');
    } else {
      this.settings.setActiveTheme('dark-theme');
    }

    if (this.ionicNamedColor === 'danger') {
      this.ionicNamedColor = 'dark'
    } else {
      this.ionicNamedColor = 'danger'
    }

  }

  loadFromCache(vendorObservable: Observable<any>) {

    vendorObservable.subscribe((data: Object) => {
      this.vendors = Object.values(data);
      //console.log(this.vendors);
      if (this.highRated) {
        this.vendors = this.vendors.filter(element => element.avgRating >= 4.0);
        //console.log(this.vendors);
      }
      if (this.thick) {
        this.vendors = this.vendors.filter(element => element.avgThickness > 5.0);
        //console.log(this.vendors);
      }
      if (this.thin) {
        this.vendors = this.vendors.filter(element => element.avgThickness <= 5.0);
        //console.log(this.vendors);
      }
      if (this.cucumber) {
        this.vendors = this.vendors.filter(element => element.avgCucumber == true);
        //console.log(this.vendors);
      }
      if (this.spicy) {
        this.vendors = this.vendors.filter(element => element.avgSpicy > 5.0);
        //console.log(this.vendors);
      }
      //console.log(this.vendors);
      this.navCtrl.push(FilterListPage, {
        vendors: this.vendors
      });


    });


  }
  openPage() {
    let url = 'https://intense-dolphin-207823.appspot.com/';
    this.cachedVendors = this.cache.loadFromObservable(url, this.http.get(this.apiUrl + 'vendors/').map(res => res.json()));
    if (this.cachedVendors != null) {
      console.log("Loading from cache");
      this.loadFromCache(this.cachedVendors);
      return;
    }
    //console.log(this.thick,this.thin,this.cucumber,this.spicy);
    this.http.get(this.apiUrl + 'vendors/').map(res => res.json()).subscribe((data: Object) => {
      this.vendors = Object.values(data);
      //console.log(this.vendors);
      if (this.highRated) {
        this.vendors = this.vendors.filter(element => element.avgRating >= 4.0);
        //console.log(this.vendors);
      }
      if (this.thick) {
        this.vendors = this.vendors.filter(element => element.avgThickness > 5.0);
        //console.log(this.vendors);
      }
      if (this.thin) {
        this.vendors = this.vendors.filter(element => element.avgThickness <= 5.0);
        //console.log(this.vendors);
      }
      if (this.cucumber) {
        this.vendors = this.vendors.filter(element => element.avgCucumber == true);
        //console.log(this.vendors);
      }
      if (this.spicy) {
        this.vendors = this.vendors.filter(element => element.avgSpicy > 5.0);
        //console.log(this.vendors);
      }
      //console.log(this.vendors);
      this.navCtrl.push(FilterListPage, {
        vendors: this.vendors
      });


    });
    //this.navCtrl.push(FilterListPage);
  }

}
