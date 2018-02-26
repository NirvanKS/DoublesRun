import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http';

import { TabsPage } from '../pages/tabs/tabs';
import { VoWPage } from '../pages/vo-w/vo-w';
import { MapPage } from '../pages/map/map';
import { RankingsPage } from '../pages/rankings/rankings';
import { FilterPage } from '../pages/filter/filter';
import { TrendingPage } from '../pages/trending/trending';
import { SuggestedPage } from '../pages/suggested/suggested';
import { VendorMarkerPage } from '../pages/vendor-marker/vendor-marker';
import { VendorAddPage } from '../pages/vendor-add/vendor-add';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
 import { Camera } from '@ionic-native/camera';


 import { VendorModalPage } from '../pages/vendor-modal/vendor-modal';
 import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    VoWPage,
    MapPage,
    RankingsPage,
    FilterPage,
    TrendingPage,
    SuggestedPage,
    VendorMarkerPage,
    VendorModalPage,
    VendorAddPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicPageModule.forChild(VendorModalPage),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    VoWPage,
    MapPage,
    RankingsPage,
    FilterPage,
    TrendingPage,
    SuggestedPage,
    VendorMarkerPage,
    VendorModalPage,
    VendorAddPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    HttpModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
