import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { MapPage } from '../map/map';
import { HomePage } from '../home/home';
import { RankingsPage } from '../rankings/rankings';
import { FilterPage } from '../filter/filter';

import { VoWPage } from '../vo-w/vo-w';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = RankingsPage;
  tab2Root = MapPage;
  tab3Root = FilterPage;
  tabIndex:Number = 0;

  constructor(public params: NavParams) {
    let tabIndex = this.params.get('tabIndex');
    if (tabIndex) {
      this.tabIndex = tabIndex;
    }
  }


}
