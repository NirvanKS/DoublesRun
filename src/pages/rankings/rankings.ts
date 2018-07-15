import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import { ApiProvider } from '../../providers/api/api';
import { NetworkProvider } from '../../providers/network/network'
import { Network } from '@ionic-native/network';
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
  vendorList: any;
  orderedVendors: any = [];
  loadim: Boolean = true;
  loader: any;
  apiUrl = "https://dream-coast-60132.herokuapp.com/";

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
    public networkProvider: NetworkProvider, public network: Network, private toastCtrl: ToastController) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad RankingsPage');
    console.log("network online?", this.networkProvider.isOnline);
    if (this.networkProvider.isOnline) {
      this.presentLoading();
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
  loadVendors(refresher?) {
    let url = 'https://dream-coast-60132.herokuapp.com/vendors/';
    let req = this.http.get(url)
      .map(res => {
        //this.loadim = true;
        return res.json();

      });

    let ttl = 60 * 60 * 3;

    if (refresher) {
      // Reload data even if it is cached
      let delayType = 'all';
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
      this.vendorList = Object.values(data);
      console.log(this.vendorList);
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

  presentLoading() {

    this.loader = this.loadingCtrl.create({
      content: "Loading Vendors..."
    });

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

}
