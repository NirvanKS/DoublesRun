import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CacheService } from 'ionic-cache';
import { SnapToMapProvider } from '../../providers/snap-to-map/snap-to-map'
import { Http } from '@angular/http';
import { TabsPage } from '../tabs/tabs';
import { Observable } from 'rxjs/Observable';
import { ThemeSettingsProvider } from '../../providers/theme-settings/theme-settings';
import { ELEMENT_PROBE_PROVIDERS } from '@angular/platform-browser/src/dom/debug/ng_probe';

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
  trendingVendors: any = [0,0,0,0,0];
  tabsPage: any = TabsPage;
  loadim: Boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http, private cache: CacheService, public snaptomap: SnapToMapProvider, public settings: ThemeSettingsProvider) {
    if (this.settings.isDark == true) {
      this.ionicNamedColor = 'light';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrendingPage');
    this.cachedVendors = this.getCache();
    //this.cachedVendors = this.cache.loadFromObservable(url, this.http.get(url + 'vendors/').map(res => res.json()));
    console.log("cash vendors", this.cachedVendors);
    if (this.cachedVendors != null) {
      console.log("Loading from cache");
      this.loadFromCache(this.cachedVendors);
      return;
    }



  }

  async getCache() {
    let key = "https://dream-coast-60132.herokuapp.com/vendors/"
    let data = await this.cache.getItem(key);
    console.log("DIS BE CACHED DATA TOTALLY ", data);
    return data;
  }

  loadFromCache(vendorObservable: Observable<any>) {

    vendorObservable.subscribe((data: Object) => {
      this.cachedVendors = Object.values(data);
      console.log("cash2", this.cachedVendors);
      var t1 = -1; var t2 = -1; var t3 = -1; var t4 = -1; var t5 = -1;
      this.cachedVendors.forEach(element => {
        console.log("here", element);
        // if (element.reviews.length > 0) { **************************REMEMBER TO UNDO DIS***************
          // this.loadim = true;
          let trendingScore =  (element.threeStars + element.fourStars + element.fiveStars)-element.baseTrending;
          if (trendingScore>t5){
            if (trendingScore>t4){
              if (trendingScore>t3){
                if (trendingScore>t2){
                  if (trendingScore>t1){
                    t5 = t4;
                    t4 = t3;
                    t3 = t2;
                    t2 = t1;
                    t1 = trendingScore;
                    this.trendingVendors[4] = this.trendingVendors[3];
                    this.trendingVendors[3] = this.trendingVendors[2];
                    this.trendingVendors[2] = this.trendingVendors[1];
                    this.trendingVendors[1] = this.trendingVendors[0];
                    this.trendingVendors[0] = element; 
                    console.log("fuss place",element);
                  }
                  else {
                    t5 = t4;
                    t4 = t3;
                    t3 = t2;
                    t2 = trendingScore;
                    this.trendingVendors[4] = this.trendingVendors[3];
                    this.trendingVendors[3] = this.trendingVendors[2];
                    this.trendingVendors[2] = this.trendingVendors[1];
                    this.trendingVendors[1] = element;
                    console.log("second", element);
                  }
                }
                else {
                  t5 = t4;
                  t4 = t3;
                  t3 = trendingScore;
                  this.trendingVendors[4] = this.trendingVendors[3];
                  this.trendingVendors[3] = this.trendingVendors[2];
                  this.trendingVendors[2] = element;
                  console.log("thud", element);
                }
              }
              else {
                t5 = t4;
                t4 = trendingScore;
                this.trendingVendors[4] = this.trendingVendors[3];
                this.trendingVendors[3] = element;
                console.log("futt", element);
              }
            }
            else {
              t5 = trendingScore;
              this.trendingVendors[4] = element;
              console.log("lassss", element);
            }
          }

          // for (let i = 1; i <= 3; i++) {
          //   this.http.get('https://dream-coast-60132.herokuapp.com/reviews/' + element.reviews[element.reviews.length - i] + '/')
          //     .map(res => res.json())
          //     .subscribe(data => {
          //       if (data.rating >= 3) {
          //         this.trendingVendors.push(element);
          //         console.log("trendy", this.trendingVendors);
          //         this.loadim = true;
          //       }
          //     });
          // }
        // }
      });
      console.log(this.trendingVendors);

    });


  }


  snapVendorToMap(v) {
    this.snaptomap.goToVendor(v.locLat, v.locLong);
    this.navCtrl.setRoot(this.tabsPage, { tabIndex: 1 });
  }

}
