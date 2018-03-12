import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { VendorReviewPage } from '../vendor-review/vendor-review';
import { Http, Headers } from '@angular/http';
import { LoginProvider } from '../../providers/login/login'
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the VendorModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-modal',
  templateUrl: 'vendor-modal.html',
})
export class VendorModalPage {
  name: string;
  description: string;
  type: boolean;
  revList: Number[];
  reviews: any;
  isLoggedIn: boolean = false;
  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
    private http: Http, public navParams: NavParams, public loginProvider: LoginProvider, private alertCtrl: AlertController) {

    this.name = navParams.get('name');
    this.description = navParams.get('description');
    this.type = navParams.get('type');
    this.revList = navParams.get('reviewList');
    //this.description = navParams.get('description');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorModalPage');
    this.isLoggedIn = this.loginProvider.isLoggedIn;
    this.loadSomeReviews();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  loadReviewPage() {
    if (!this.isLoggedIn) {
      let alert = this.alertCtrl.create({
        title: 'You must be logged in to add a review',
        buttons: [{
          text: 'Login',
          handler: () => {
            // user has clicked the alert button
            // begin the alert's dismiss transition
            let navTransition = alert.dismiss();

            // start some async method
            this.loginProvider.login().then(() => {
              // once the async operation has completed
              // then run the next nav transition after the
              // first transition has finished animating out

              navTransition.then(() => {
                this.navCtrl.pop();
              });
            });
            return false;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        ]
      });

      alert.present();
    }
    this.navCtrl.push(VendorReviewPage, {
      vendorName: this.name,
      vendorDescription: this.description,
      vendorType: this.type
    });
  }

  loadSomeReviews() {
    for (var i = this.revList.length - 1; i > this.revList.length - 6; i++) {
      if (i < 0) break;
      this.http.get('http://127.0.0.1:8000/reviews/' + i)
        .map(res => res.json())
        .subscribe((data: Object) => {
          this.reviews = Object.values(data);
        })
    }
  }

}
