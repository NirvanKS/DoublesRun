import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import { ApiProvider } from '../../providers/api/api';
import { VendorAddPage } from '../vendor-add/vendor-add';
import { NetworkProvider } from '../../providers/network/network'
import { Network } from '@ionic-native/network';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { SnapToMapProvider } from '../../providers/snap-to-map/snap-to-map'
import { MapPage } from '../map/map'
import { ToastController } from 'ionic-angular';

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
  vendorList: any = [];
  orderedVendors: any = [];
  loadim: Boolean = true;
  loader: any;
  apiUrl = "https://dream-coast-60132.herokuapp.com/";
  difference: Set<any>;
  deleteCheck: boolean = false;

  validateGeoLoc: boolean = false;
  successValidate: boolean = false;
  notFound: boolean = true;
  confirmVend: boolean = false;
  mark: any;
  currGeoLocLat: number;
  currGeoLocLong: number;
  vendorFormName: string;
  vendorForm = {
    Type: true,
    Name: '',
    Description: '',
    locLat: 0,
    locLong: 0,
    pic: ''
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private cache: CacheService, public api: ApiProvider,
    public loadingCtrl: LoadingController, public snaptomap: SnapToMapProvider,
    public networkProvider: NetworkProvider, public network: Network, private toastCtrl: ToastController,
    private diagnostic: Diagnostic, public geolocation: Geolocation) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad RankingsPage');
    console.log("network online?", this.networkProvider.isOnline);
    if (this.networkProvider.isOnline) {
      this.presentLoading("vendors");
    }
    this.loadVendors();
    if (this.network.type != "none") {
      let exists = await this.cache.itemExists("vendorData");
      if (!exists) return;
      this.vendorForm = await this.cache.getItem("vendorData");
      //deal with a single vendor or an array of vendors here.

      if (this.vendorForm instanceof Array)//start of array hadnling
      {
        this.vendorForm.forEach(vendor => {
          this.validateGeoLoc = false;
          this.successValidate = false;
          this.notFound = true;
          if (vendor.locLat != 0 && vendor.locLong != 0) {
            this.validateGeoLoc = true;
            if ((vendor.pic != '') && (vendor.Name != '') && (vendor.Description != '')) {
              this.successValidate = true;
            }
          }
          if (this.successValidate == false && this.validateGeoLoc == true) {
            this.failValidateToast();
          }
          else if (this.successValidate == false && this.validateGeoLoc == false) {
            this.GeoToast();
          }
          else {
            this.checkForVendorDuplicates().subscribe((data: Object) => {
              this.mark = Object.values(data);
              this.mark.forEach(element => {
                if (element.locLong <= (vendor.locLong + 0.09) || element.locLong >= (vendor.locLong - 0.09)) {
                  if (element.locLat <= (vendor.locLat + 0.09) || element.locLat >= (vendor.locLat - 0.09)) {
                    if (element.Name == vendor.Name) {
                      console.log("Same Name Found!" + element.Name);
                      this.notFound = false;
                    }
                  }
                  //
                }
              })
              if (this.notFound == true) {
                this.addVendor2(vendor);
                //we should be clearing the cache of all old offline vendors here

                this.presentSuccessToast();
              }
              else {
                this.presentFailToast()
              }

            });;


            this.confirmVend = true;
          }


        });
        this.cache.removeItem("vendorData");
      }//end of array handling
      else { //start of single vendor handling
        if (this.vendorForm.locLat != 0 && this.vendorForm.locLong != 0) {
          this.validateGeoLoc = true;
          if ((this.vendorForm.pic != '') && (this.vendorForm.Name != '') && (this.vendorForm.Description != '')) {
            this.successValidate = true;
          }
        }
        if (this.successValidate == false && this.validateGeoLoc == true) {
          this.failValidateToast();
        }
        else if (this.successValidate == false && this.validateGeoLoc == false) {
          this.GeoToast();
        }
        else {
          /*if Vendor Info is NOT in the Database (the Vendoris legit and does NOT exist yet){
            this.confirmVend = true;
            this.dismiss();
            this.confirmVend = false;
          }
          else if Vendor Info is ALREADY in the database ( the vendor already exists)
          {
            this.dismiss();
          }
          */
          this.checkForVendorDuplicates().subscribe((data: Object) => {
            //this.markers = data;
            this.mark = Object.values(data);
            this.mark.forEach(element => {
              if (element.locLong <= (this.currGeoLocLong + 0.09) || element.locLong >= (this.currGeoLocLong - 0.09)) {

                if (element.locLat <= (this.currGeoLocLat + 0.09) || element.locLat >= (this.currGeoLocLat - 0.09)) {

                  if (element.Name == this.vendorFormName) {
                    console.log("Same Name Found!" + element.Name);
                    this.notFound = false;
                  }
                }
                //
              }
            })
            if (this.notFound == true) {
              this.addVendor();
              //we should be clearing the cache of all old offline vendors here
              this.cache.removeItem("vendorData");
              this.presentSuccessToast();
            }
            else {
              this.presentFailToast()
            }

          });;


          this.confirmVend = true;
        }

      } //end of single vendor handling
    }
    //can be loadVendors(false)
    //this.loadim = true;
  }

  openVendor(vendor) {
    this.snaptomap.goToVendor(vendor.locLat, vendor.locLong);
    this.navCtrl.parent.select(1);
  }
  // Load either from API or Cache
  async loadVendors(refresher?) {
    //get cache list if it exists
    var cacheList = [];
    var url = 'https://dream-coast-60132.herokuapp.com/vendors/';
    cacheList = await this.cache.getItem('vendorIDs')
      .catch(() => {
        console.log('vendor cache empty');
      });
    //if the cache list exists, get the live list and do set difference
    if (cacheList != []) {
      this.http.get('https://dream-coast-60132.herokuapp.com/vendorids/')
        .map(data => data.json())
        .subscribe(data => {
          let IDlist = [];
          data.forEach(element => {
            IDlist.push(element.id);
          });
          let local = new Set(cacheList);
          let live = new Set(IDlist);
          //get items of the local set that are not in the live set - i.e deleted vendors still in local
          // items of the live set that are not in the local set would be new vendors
          // but loaddelayedobservable should handle those
          this.difference = new Set(
            [...local].filter(x => !live.has(x)));
          console.log('this is?', local);
          //iterate through the deleted vendor set and remove them from cache
          if (this.vendorList != [] && !this.deleteCheck) {
            this.difference.forEach(el => {
              //instead of subscribing to the cache observable twice,
              //cater for whichever event finishes first to be the one to remove the difference vendors
              //seems like this runs after each time, because of the get request probably, too sleepy to think it through
              this.vendorList.forEach(element => {
                if (element.id == el) {
                  let index = this.vendorList.indexOf(element);
                  this.vendorList.splice(index, 1);
                  local.delete(el);
                  console.log('locla', local);
                  cacheList = [...local];
                  this.cache.saveItem('vendorIDs', cacheList);
                  this.cache.saveItem(url, this.vendorList);
                }
              });
            });
            this.deleteCheck = true;
          }
          console.log('post delete', this.vendorList);
        });

    }
    console.log(cacheList);

    let req = this.http.get(url)
      .map(res => {
        //this.loadim = true;
        let list = [];
        res.json().forEach(element => {
          list.push(element.id);
        });
        this.cache.saveItem('vendorIDs', list);

        return res.json();

      });

    let ttl = 60 * 60 * 24;

    if (refresher) {
      // Reload data even if it is cached
      let delayType = 'all';
      this.cache.clearGroup(url);
      this.cache.removeItem('vendorIDs');
      this.cache.removeItem(url);
      this.vendors = this.cache.loadFromDelayedObservable(url, req, 'none', ttl, delayType);
      // Hide the refresher once loading is done
      this.vendors.subscribe(data => {
        refresher.complete();
        //console.log(data); //testing cache stuff
        //let x = this.cache.loadFromObservable(url, req);    //url here in this case is the actual key, but not the GROUP KEY
        //console.log(x);
      });
    } else {
      // Load with Group key and custom TTL
      this.vendors = this.cache.loadFromObservable(url, req);

      // Or just load without additional settings
      // this.films = this.cache.loadFromObservable(url, req);
    }

    this.vendors.subscribe((data: Object) => {
      this.vendorList = data;
      console.log(data);
      console.log('vlist', this.vendorList);
      let o = this.vendorList.sort(function compare(a, b) {
        // if (a.avgRating < b.avgRating)
        //   return -1;
        // if (a.avgRating > b.avgRating)
        //   return 1;
        // return 0;
        //this.loadim = true;
        return b.rankingScore - a.rankingScore;
      })
      this.orderedVendors = o.slice(0, 10);

      // console.log("ordered" + this.orderedVendors[1].rankingScore);
    })
    if (this.orderedVendors != [] && this.loader != undefined) {
      this.loader.dismiss();
    }

  }

  // Invalidate for a specific group key
  // invalidateCache() {
  //   this.cache.clearGroup(this.vendorsKey);
  // }

  // Pull to refresh and force reload
  forceReload(refresher) {
    this.loadVendors(refresher);
  }

  presentLoading(type) {
    if (type == "vendors") {
      this.loader = this.loadingCtrl.create({
        content: "Loading Vendors..."
      });
    }
    if (type == "location") {
      this.loader = this.loadingCtrl.create({
        content: "Getting location..."
      });
    }

    this.loader.present();

  }

  addVendor() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post(this.apiUrl + 'vendors/', JSON.stringify(this.vendorForm), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);


      })
  }

  addVendor2(vendor) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post(this.apiUrl + 'vendors/', JSON.stringify(vendor), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
      })
  }

  failValidateToast() {
    let toast = this.toastCtrl.create({
      message: 'All fields required!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  GeoToast() {
    let toast = this.toastCtrl.create({
      message: 'Please turn on location services!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  checkForVendorDuplicates(): any {
    //return this.http.get('http://127.0.0.1:8000/vendors/').map(res => res.json());
    return this.http.get(this.apiUrl + 'vendors/').map(res => res.json());
    /*
    if(this.notFound == false)
    {
      return false;
    }
    return true;
    */
  }


  presentFailToast() {
    let toast = this.toastCtrl.create({
      message: 'Vendor already exists!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  presentSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Vendor added! Refresh the map!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  //add vendor code 
  addOfflineMarker() {
    var geoNumberLat = 0;
    var geoNumberLon = 0;
    let options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };
    this.presentLoading("location");
    console.log('im gonna try!');
    let watchLoc = this.geolocation.watchPosition(options)
      .subscribe((position) => {
        console.log(position);
        if (position.coords == undefined) {
          //this MIGHT mean timeout error, position becomes the error object if one occurs :)
          this.geolocationError(2);
          console.log('Error getting location');
          this.loader.dismiss();
          watchLoc.unsubscribe();
          return;
        }
        console.log("trying my best here ", position.coords.accuracy, "m");
        if (position.coords.accuracy > 30) {
          return;
        }
        console.log("got location?", position.coords.accuracy, "m");
        geoNumberLat = position.coords.latitude;
        geoNumberLon = position.coords.longitude;
        if (geoNumberLat == 0 && geoNumberLon == 0) {
          this.geolocationError(3);
        }
        else {
          watchLoc.unsubscribe();
          this.loader.dismiss();
          this.navCtrl.push(VendorAddPage, {
            geoNumberLat: geoNumberLat,
            geoNumberLon: geoNumberLon,
          });
        }
      }, (error: any) => { //errors aren't being picked up on watchPosition
        if (error.code == 3) {
          this.geolocationError(1)
        }
        console.log('Error getting location', error);

      });




  }

  geolocationError(type) {
    var toast;
    if (type == 1) {
      toast = this.toastCtrl.create({
        message: "Can't get your location, try restarting your device!",
        duration: 3000,
        position: 'bottom'
      });
    }
    else if (type == 2) {
      toast = this.toastCtrl.create({
        message: "Error getting location.",
        duration: 3000,
        position: 'bottom'
      });
    }
    else if (type == 3) {
      toast = this.toastCtrl.create({
        message: "Error accessing your location services :(",
        duration: 3000,
        position: 'bottom'
      });
    }
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
