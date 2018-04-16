import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CacheService } from 'ionic-cache';
import { SnapToMapProvider } from '../../providers/snap-to-map/snap-to-map'
import { Http } from '@angular/http';
import { TabsPage } from '../tabs/tabs';
import { Observable } from 'rxjs/Observable';
import { ThemeSettingsProvider } from '../../providers/theme-settings/theme-settings';

/**
 * Generated class for the TrendingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trending',
  templateUrl: 'trending.html',
})
export class TrendingPage {
  public ionicNamedColor: string = 'danger';
  cachedVendors: any;
  trendingVendors: any = [];
  tabsPage: any = TabsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http, private cache: CacheService, public snaptomap: SnapToMapProvider, public settings: ThemeSettingsProvider) {
    if (this.settings.isDark == true) {
      this.ionicNamedColor = 'light';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrendingPage');

    let url = 'https://dream-coast-60132.herokuapp.com/';
    this.cachedVendors = this.cache.loadFromObservable(url, this.http.get(url + 'vendors/').map(res => res.json()));
    console.log("cash vendors", this.cachedVendors);
    if (this.cachedVendors != null) {
      console.log("Loading from cache");
      this.loadFromCache(this.cachedVendors);
      return;
    }



  }

  loadFromCache(vendorObservable: Observable<any>) {

    vendorObservable.subscribe((data: Object) => {
      this.cachedVendors = Object.values(data);
      console.log("cash2", this.cachedVendors);
      this.cachedVendors.forEach(element => {
        if (element.reviews.length > 0) {
          for (let i = 1; i <= 1; i++) {
            this.http.get('https://dream-coast-60132.herokuapp.com/reviews/' + element.reviews[element.reviews.length - i] + '/')
              .map(res => res.json())
              .subscribe(data => {
                if (data.rating >= 3) {
                  this.trendingVendors.push(element);
                  console.log("trendy", this.trendingVendors);
                }
              });
          }
        }
      });

    });


  }


  snapVendorToMap(v) {
    this.snaptomap.goToVendor(v.locLat, v.locLong);
    this.navCtrl.setRoot(this.tabsPage, { tabIndex: 1 });
  }

}
