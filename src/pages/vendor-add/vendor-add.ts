import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Vendor } from './vendor';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastController, Platform, ModalController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { CacheService } from 'ionic-cache';
import { Storage } from '@ionic/storage';
import { AddVendorIntroPage } from '../add-vendor-intro/add-vendor-intro';
import { NetworkProvider } from '../../providers/network/network'
import { Network } from '@ionic-native/network';
/**
 * Generated class for the VendorAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-add',
  templateUrl: 'vendor-add.html',
})
export class VendorAddPage {
  vendor: Vendor;
  vendorForm = {
    Type: true,
    Name: '',
    Description: '',
    locLat: 0,
    locLong: 0,
    pic: ''
  }
  successValidate: boolean = false;
  validateGeoLoc: boolean = false;
  vendorType: any = "dv";
  mark: any;
  notFound: boolean = true;
  currGeoLocLat: number;
  currGeoLocLong: number;
  vendorFormName: string;
  confirmVend: boolean = false;
  apiUrl = "https://dream-coast-60132.herokuapp.com/";
  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
    public navParams: NavParams, private camera: Camera, private http: Http,
    private toastCtrl: ToastController, public api: ApiProvider, private cache: CacheService,
    platform: Platform, public storage: Storage, public modalCtrl: ModalController, public networkProvider: NetworkProvider, public network: Network) {
    platform.ready().then(() => {
      this.storage.get('vendorTutShown').then((result) => {

        if (result) {
          //do nothing
        } else {
          let tutModal = this.modalCtrl.create(AddVendorIntroPage);
          tutModal.present();
          this.storage.set('vendorTutShown', true);
        }

      });
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorAddPage');
    // this.apiUrl = this.api.url;
  }



  dismiss() {

    //this.viewCtrl.dismiss({'confirm': this.confirmVend});
    this.navCtrl.pop();
  }

  async logForm(form) {
    if (this.vendorType == 'dv') this.vendorForm.Type = true;
    else this.vendorForm.Type = false;
    this.vendorForm.locLat = this.navParams.get('geoNumberLat');
    this.vendorForm.locLong = this.navParams.get('geoNumberLon');
    this.currGeoLocLat = this.navParams.get('geoNumberLat');
    this.currGeoLocLong = this.navParams.get('geoNumberLon');
    this.vendor = this.vendorForm;
    this.vendorFormName = this.vendorForm.Name;

    if (this.networkProvider.isOnline == false) {
      //cache vendor object
      let exists = await this.cache.itemExists("vendorData");
      if (exists) {   //this checks if the cache object exists, expired or not. Should make sure to remove the object from cache after we add it to live db to prevent promise errors.
        console.log("Vendor cache offline have some ppl in it already");
        let currCache = await this.cache.getItem("vendorData");
        var newOfflineVendorArray = [];
        console.log(currCache);
        if (currCache instanceof Array) {
          newOfflineVendorArray = currCache;
        }
        else {
          console.log("pushing an empty array with now 1 element inside", currCache);
          newOfflineVendorArray.push(currCache);
        }
        newOfflineVendorArray.push(this.vendorForm);
        this.cache.removeItem("vendorData"); //clearing the cache of old data.
        this.cache.saveItem("vendorData", newOfflineVendorArray);
      }
      else {  //cache empty
        console.log("first time fo everything bud");
        //could make an empty array and push it here to make code simpler later on with cache.
        //wont have to do a bunch of different cases
        this.cache.saveItem("vendorData", this.vendorForm);
      }

    }


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
          this.presentSuccessToast();
        }
        else {
          this.presentFailToast()
        }

      });;


      this.confirmVend = true;

      //this.dismiss();
      this.navCtrl.pop();
      //this.weep = false;
      console.log(this.vendor);
    }
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.vendorForm.pic = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  deletePhoto(index) {
    this.vendorForm.pic = null;
  }

  addVendor() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //this.http.post('http://127.0.0.1:8000/vendors/', JSON.stringify(this.vendorForm), { headers: headers })
    this.http.post(this.apiUrl + 'vendors/', JSON.stringify(this.vendorForm), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);


      })
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
      message: 'Please allow us access to your location services!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


}
