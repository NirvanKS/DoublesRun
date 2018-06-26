import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Vendor } from './vendor';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import { CacheService } from 'ionic-cache';
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
  vendorType: any;
  mark: any;
  notFound: boolean = true;
  currGeoLocLat: number;
  currGeoLocLong: number;
  vendorFormName: string;
  confirmVend: boolean = false;
  apiUrl="https://intense-dolphin-207823.appspot.com/";
  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
    public navParams: NavParams, private camera: Camera, private http: Http, 
    private toastCtrl: ToastController, public api: ApiProvider,private cache: CacheService) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorAddPage');
    // this.apiUrl = this.api.url;
  }



  dismiss() {

    //this.viewCtrl.dismiss({'confirm': this.confirmVend});
    this.navCtrl.pop();
  }

  logForm(form) {
    if (this.vendorType == 'dv') this.vendorForm.Type = true;
    else this.vendorForm.Type = false;
    this.vendorForm.locLat = this.navParams.get('geoNumberLat');
    this.vendorForm.locLong = this.navParams.get('geoNumberLon');
    this.currGeoLocLat = this.navParams.get('geoNumberLat');
    this.currGeoLocLong = this.navParams.get('geoNumberLon');
    this.vendor = this.vendorForm;
    this.vendorFormName = this.vendorForm.Name;
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
    this.http.post(this.apiUrl+'vendors/', JSON.stringify(this.vendorForm), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        

      })
  }

  checkForVendorDuplicates(): any {
    //return this.http.get('http://127.0.0.1:8000/vendors/').map(res => res.json());
    return this.http.get(this.apiUrl+'vendors/').map(res => res.json());
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
