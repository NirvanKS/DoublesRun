import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { MapPage } from '../map/map';
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

  constructor() {
    
  }


}
