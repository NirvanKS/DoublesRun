import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Vendor } from './vendor';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
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
    Name: '',
    Description: '',
    locLat: 0,
    locLong: 0,
    pic: ''
  }
  mark: any;
  currGeoLocLat: number;
  currGeoLocLong: number;
  vendorFormName: string;
  confirmVend: boolean = false;
  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
    public navParams: NavParams, private camera: Camera, private http: Http, private toastCtrl: ToastController) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorAddPage');
  }



  dismiss() {

    //this.viewCtrl.dismiss({'confirm': this.confirmVend});
    this.navCtrl.pop();
  }

  logForm(form) {
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
    if (this.checkForVendorDuplicates) this.addVendor();
    else this.presentSuccessToast();

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
    this.http.post('http://127.0.0.1:8000/vendors/', JSON.stringify(this.vendorForm), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
      })
  }

  checkForVendorDuplicates(): Boolean {
    this.http.get('http://127.0.0.1:8000/vendors/').map(res => res.json()).subscribe((data: Object) => {
      //this.markers = data;
      this.mark = Object.values(data);
      let x = 0;
      this.mark.forEach(element => {
        if (element.locLong <= (this.currGeoLocLong + 0.09) || element.locLong >= (this.currGeoLocLong - 0.09)) {

          if (element.locLat <= (this.currGeoLocLat + 0.09) || element.locLat >= (this.currGeoLocLat - 0.09)) {

            if (element.Name == this.vendorFormName) {
              this.presentFailToast()
              return false;
            }
          }
          //
        }
      })

    });
    return true;
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
      message: 'Vendor added!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


}
