import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import { ApiProvider } from '../../providers/api/api';
import { SnapToMapProvider } from '../../providers/snap-to-map/snap-to-map'
import { MapPage } from '../map/map'
/**
/**
 * Generated class for the RankingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rankings',
  templateUrl: 'rankings.html',
})
export class RankingsPage {

  vendorsKey = "vendor-ranking-list"
  vendors: Observable<any>;
  vendorList: any;
  orderedVendors: any;
  loadim: Boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private cache: CacheService, public api: ApiProvider
    , public snaptomap: SnapToMapProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RankingsPage');
    this.loadVendors();  //can be loadVendors(false)
    this.loadim = true;
  }

  openVendor(vendor) {
    this.snaptomap.goToVendor(vendor.locLat, vendor.locLong);
    this.navCtrl.parent.select(1);
  }
  // Load either from API or Cache
  loadVendors(refresher?) {
    let url = 'https://dream-coast-60132.herokuapp.com/vendors/';
    let req = this.http.get(url)
      .map(res => {

        this.loadim = true;
        return res.json();
      });

    let ttl = 60 * 60 * 3;

    if (refresher) {
      // Reload data even if it is cached
      let delayType = 'all';
      this.vendors = this.cache.loadFromDelayedObservable(url, req, this.vendorsKey, ttl, delayType);
      // Hide the refresher once loading is done
      this.vendors.subscribe(data => {
        refresher.complete();
        //let x = this.cache.loadFromObservable(url, req);    //url here in this case is the actual key, but not the GROUP KEY
        //console.log(x);
      });
    } else {
      // Load with Group key and custom TTL
      this.vendors = this.cache.loadFromObservable(url, req, this.vendorsKey, ttl);

      // Or just load without additional settings
      // this.films = this.cache.loadFromObservable(url, req);
    }

    this.vendors.subscribe((data: Object) => {
      this.vendorList = Object.values(data);
      console.log(this.vendorList);
      this.orderedVendors = this.vendorList.sort(function compare(a, b) {
        // if (a.avgRating < b.avgRating)
        //   return -1;
        // if (a.avgRating > b.avgRating)
        //   return 1;
        // return 0;
        this.loadim = true;
        return b.rankingScore - a.rankingScore;
      })
      // console.log("ordered" + this.orderedVendors[1].rankingScore);
    })

  }

  // Invalidate for a specific group key
  invalidateCache() {
    this.cache.clearGroup(this.vendorsKey);
  }

  // Pull to refresh and force reload
  forceReload(refresher) {
    this.loadVendors(refresher);
  }
}
