import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { VendorReviewPage } from '../vendor-review/vendor-review';
import { Http, Headers } from '@angular/http';
import { LoginProvider } from '../../providers/login/login';
import {ApiProvider} from '../../providers/api/api';
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
  ratings: any = [];
  ratingsEmpty:boolean = true;
  comments: any = [];
  names:any = [];


  avgRating: Number;
  pic: any;
  avgThickness: Number;
  avgTime: Number;
  avgCucumber: boolean; 
  avgSpicy: Number;
  revList: any;
  reviews: any;
  vendorID: any;

  day:boolean = true;
  thickness:any='Thin Barra';
  spiciness:string='Mild Pepper';
  cuc:string='No Cucumber';
  isLoggedIn: boolean = false;
  apiUrl="https://dream-coast-60132.herokuapp.com/";
  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
    private http: Http, public navParams: NavParams, public loginProvider: LoginProvider, 
    private alertCtrl: AlertController, public api: ApiProvider) {

    this.name = navParams.get('name');
    this.pic = navParams.get('img');
    this.description = navParams.get('description');
    this.type = navParams.get('type');
    this.revList = navParams.get('reviewList');
    if (this.revList.length>0) this.ratingsEmpty = false;
    this.avgRating = navParams.get('avgRating'); this.avgCucumber = navParams.get('avgCucumber');
    this.avgThickness = navParams.get('avgThickness'); this.avgSpicy = navParams.get('avgSpicy');
    if (this.avgThickness>5) this.thickness = 'Thick Barra';
    if (this.avgSpicy>5) this.spiciness = 'Hell';
    if (this.avgCucumber) this.cuc = 'Yes Cucumber';
    this.avgTime = navParams.get('avgTime');
    
    if (this.avgTime>18) this.day = false;
    this.vendorID = navParams.get('vendorID');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorModalPage');
    console.log(this.revList[this.revList.length - 1]);
    this.isLoggedIn = this.loginProvider.isLoggedIn;
    // this.apiUrl = this.api.url;
    this.loadSomeReviews();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  loadReviewPage() {
    if (this.isLoggedIn == true) {
      this.navCtrl.push(VendorReviewPage, {
        vendorName: this.name,
        vendorDescription: this.description,
        vendorType: this.type,
        vendorID: this.vendorID
      });
    }
    if (this.isLoggedIn == false) {
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
      alert.didLeave.subscribe(x => {
        if (this.isLoggedIn == true) {
          this.navCtrl.push(VendorReviewPage, {
            vendorName: this.name,
            vendorDescription: this.description,
            vendorType: this.type,
            vendorID: this.vendorID
          });
        }
      })
    }

  }

  loadSomeReviews() {
    for (var i = this.revList.length - 1; i > this.revList.length - 6; i--) {
      if (i < 0) break;
      //this.http.get('http://127.0.0.1:8000/reviews/' + this.revList[i] + '/')
      this.http.get(this.apiUrl+'reviews/' + this.revList[i] + '/')
        .map(res => res.json())
        .subscribe((data: Object) => {
          this.reviews = Object.values(data);
          let r = (this.reviews[1])
          var numbers = Array.from(new Array(r),(val,index)=>index+1);
          this.ratings.push(numbers);
          this.comments.push(this.reviews[5]);

          //this.http.get('http://127.0.0.1:8000/users/' + this.reviews[7] + '/')
          this.http.get(this.apiUrl+'users/' + this.reviews[7] + '/')
            .map(res => res.json())
            .subscribe((data: Object) => {
              let u = Object.values(data);
              this.names.push(u[1]);
            });
        })
    }
  }

}
