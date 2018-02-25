import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Vendor } from './vendor';
import {Camera,CameraOptions} from '@ionic-native/camera';

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
  public base64Image : string;
  vendorForm = {
    name: '',
    description:'',
    locationLat:0,
    locationLon:0
  }
  confirmVend: boolean = false;
  constructor(public viewCtrl: ViewController ,public navCtrl: NavController, public navParams: NavParams, private camera : Camera) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorAddPage');
  }

  

  dismiss() {

    this.viewCtrl.dismiss({'confirm': this.confirmVend});
  }

  logForm(form){
    this.vendorForm.locationLat = this.navParams.get('geoNumberLat');
    this.vendorForm.locationLon = this.navParams.get('geoNumberLon');
    this.vendor = this.vendorForm;

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
    this.confirmVend = true;
    this.dismiss();
    //this.weep = false;
    console.log(this.vendor);
  }

  takePhoto() {
    const options : CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options) .then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
      }, (err) => {
        console.log(err);
      });
  }

  deletePhoto(index){
    this.base64Image = null;
 }

}
