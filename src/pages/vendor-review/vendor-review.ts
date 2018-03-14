import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { LoginProvider } from '../../providers/login/login'
/**
 * Generated class for the VendorReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-review',
  templateUrl: 'vendor-review.html',
})
export class VendorReviewPage {
  name: String;
  description: String;
  type: boolean;
  currUserID: string;


  review = {
    userID: '',
    rating: 0,
    thickness: 0,
    spicy: 0,
    cucumber: false,
    time: 0,
    comment: "",
    vendorID: ""

  }
  NonReview = {
    userID: '',
    rating: 0,
    time: 0,
    comment: "",
    vendorID: ""
  }

  constructor(public navCtrl: NavController, private http: Http, public navParams: NavParams, public loginProvider: LoginProvider) {
    this.name = navParams.get('vendorName');
    this.description = navParams.get('vendorDescription');
    this.type = navParams.get('vendorType');
    this.review.vendorID = navParams.get('vendorID');
    this.NonReview.vendorID = navParams.get('vendorID');
    this.currUserID = this.loginProvider.userId;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorReviewPage');
  }

  logReview(form) {
    var d = new Date();
    this.review.time = d.getHours();
    this.review.userID = this.currUserID;
    console.log(this.review);
    this.addReview(this.review);
    this.navCtrl.pop();


  }

  logNonReview(form) {
    var d = new Date();
    this.NonReview.time = d.getHours();
    this.NonReview.userID = this.currUserID;
    this.addReview(this.NonReview);
    console.log(this.NonReview);
    this.navCtrl.pop();
  }

  addReview(review) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post('http://127.0.0.1:8000/reviews/', JSON.stringify(review), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log("httppost responsea:", data);

      })
  }

}
