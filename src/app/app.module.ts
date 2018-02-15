import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { VoWPage } from '../pages/vo-w/vo-w';
import { MapPage } from '../pages/map/map';
import { RankingsPage } from '../pages/rankings/rankings';
import { FilterPage } from '../pages/filter/filter';
import { TrendingPage } from '../pages/trending/trending';
import { SuggestedPage } from '../pages/suggested/suggested';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
 } from '@ionic-native/google-maps';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    VoWPage,
    MapPage,
    RankingsPage,
    FilterPage,
    TrendingPage,
    SuggestedPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
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
    SuggestedPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
