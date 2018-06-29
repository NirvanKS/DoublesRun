import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SuggIntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sugg-intro',
  templateUrl: 'sugg-intro.html',
})
export class SuggIntroPage {

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  continue(){
    this.viewCtrl.dismiss();
  }

}
