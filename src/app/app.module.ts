import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http';
import { CacheModule } from 'ionic-cache';

import { TabsPage } from '../pages/tabs/tabs';
import { VoWPage } from '../pages/vo-w/vo-w';
import { VoWPageModule } from '../pages/vo-w/vo-w.module';
import { MapPage } from '../pages/map/map';
import { MapPageModule } from '../pages/map/map.module';
import { RankingsPage } from '../pages/rankings/rankings';
import { RankingsPageModule } from '../pages/rankings/rankings.module';
import { FilterPage } from '../pages/filter/filter';
import { FilterPageModule } from '../pages/filter/filter.module';
import { TrendingPage } from '../pages/trending/trending';
import { TrendingPageModule } from '../pages/trending/trending.module';
import { SuggestedPage } from '../pages/suggested/suggested';
import { SuggestedPageModule } from '../pages/suggested/suggested.module';
import { VendorMarkerPage } from '../pages/vendor-marker/vendor-marker';
import { VendorMarkerPageModule } from '../pages/vendor-marker/vendor-marker.module';
import { VendorAddPage } from '../pages/vendor-add/vendor-add';
import { VendorAddPageModule } from '../pages/vendor-add/vendor-add.module';
import { VendorReviewPage } from '../pages/vendor-review/vendor-review';
import { VendorReviewPageModule } from '../pages/vendor-review/vendor-review.module';
import { FilterListPage } from '../pages/filter-list/filter-list';
import { FilterListPageModule } from '../pages/filter-list/filter-list.module';
import { IntroPage } from '../pages/intro/intro';
import { IntroPageModule } from '../pages/intro/intro.module';
import { AddVendorIntroPage } from '../pages/add-vendor-intro/add-vendor-intro';
import { AddVendorIntroPageModule } from '../pages/add-vendor-intro/add-vendor-intro.module';
import { SuggIntroPage } from '../pages/sugg-intro/sugg-intro';
import { SuggIntroPageModule } from '../pages/sugg-intro/sugg-intro.module';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';


import { VendorModalPage } from '../pages/vendor-modal/vendor-modal';
import { VendorModalPageModule } from '../pages/vendor-modal/vendor-modal.module';
import { HomePage } from '../pages/home/home';
import { HomePageModule } from '../pages/home/home.module';
import { IonicPageModule } from 'ionic-angular';
import { LoginProvider } from '../providers/login/login';
import { GooglePlus } from '@ionic-native/google-plus'
import { ApiProvider } from '../providers/api/api';
import { SnapToMapProvider } from '../providers/snap-to-map/snap-to-map';
import { ThemeSettingsProvider } from '../providers/theme-settings/theme-settings';
import { NetworkProvider } from '../providers/network/network';
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    // VoWPage,
    // MapPage,
    // RankingsPage,
    // FilterPage,
    // TrendingPage,
    // SuggestedPage,
    // VendorMarkerPage,
    // VendorModalPage,
    // VendorAddPage,
    // VendorReviewPage,
    // FilterListPage,
    // HomePage,
    // IntroPage,
    // AddVendorIntroPage,
    // SuggIntroPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicPageModule.forChild(VendorModalPage),
    CacheModule.forRoot(),
    IonicStorageModule.forRoot(),
    AddVendorIntroPageModule,
    FilterPageModule,
    FilterListPageModule,
    HomePageModule,
    IntroPageModule,
    MapPageModule,
    RankingsPageModule,
    SuggIntroPageModule,
    SuggestedPageModule,
    TrendingPageModule,
    VendorAddPageModule,
    VendorMarkerPageModule,
    VendorModalPageModule,
    VendorReviewPageModule,
    VoWPageModule,

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
    VendorAddPage,
    VendorReviewPage,
    FilterListPage,
    HomePage,
    IntroPage,
    AddVendorIntroPage,
    SuggIntroPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    HttpModule,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    GooglePlus,
    ApiProvider,
    SnapToMapProvider,
    ThemeSettingsProvider,
    NetworkProvider,
    Network,
  ]
})
export class AppModule { }
