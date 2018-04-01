import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FilterListPage } from '../filter-list/filter-list';
import { Http, Headers } from '@angular/http';

/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  apiUrl="https://dream-coast-60132.herokuapp.com/";
  vendors:any;
  highRated:boolean = false;
  thick:boolean = false;
  thin:boolean = false;
  cucumber:boolean = false;
  spicy:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,private http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
  }

  openPage(){
    //console.log(this.thick,this.thin,this.cucumber,this.spicy);
    this.http.get(this.apiUrl+'vendors/').map(res => res.json()).subscribe((data: Object) => {
      this.vendors = Object.values(data);
      //console.log(this.vendors);
      if(this.highRated)
      {
        this.vendors = this.vendors.filter(element => element.avgRating >= 4.0);
        //console.log(this.vendors);
      }
      if(this.thick)
      {
        this.vendors = this.vendors.filter(element => element.avgThickness > 5.0);
        //console.log(this.vendors);
      }
      if(this.thin)
      {
        this.vendors = this.vendors.filter(element => element.avgThickness <= 5.0);
        //console.log(this.vendors);
      }
      if(this.cucumber)
      {
        this.vendors = this.vendors.filter(element => element.avgCucumber == true);
        //console.log(this.vendors);
      }
      if(this.spicy)
      {
        this.vendors = this.vendors.filter(element => element.avgSpicy > 5.0);
        //console.log(this.vendors);
      }
      console.log(this.vendors);
      this.navCtrl.push(FilterListPage);


    });
    //this.navCtrl.push(FilterListPage);
  }

}
