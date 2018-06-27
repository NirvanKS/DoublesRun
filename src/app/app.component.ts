import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { VoWPage } from '../pages/vo-w/vo-w';
import { TrendingPage } from '../pages/trending/trending';
import { SuggestedPage } from '../pages/suggested/suggested';
import { HomePage } from '../pages/home/home';
import { RankingsPage } from '../pages/rankings/rankings';
import { CacheService } from "ionic-cache";
import { timer } from 'rxjs/observable/timer';
import { ThemeSettingsProvider } from '../providers/theme-settings/theme-settings';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  showSplash = true;
  pages: Array<{ title: string, component: any }>;
  selectedTheme: String;
  rootPage: any = TabsPage;


  constructor(platform: Platform, cache: CacheService, statusBar: StatusBar, splashScreen: SplashScreen, public settings: ThemeSettingsProvider) {
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val;
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      cache.setDefaultTTL(60 * 60 * 6); //cached data valid for 6 hours, could decrease or increase depending on what we want
      cache.setOfflineInvalidate(false);   // Keep our cached results when device is offline
      statusBar.styleDefault();
      splashScreen.hide();
      //timer(3000).subscribe(() => this.showSplash = false) removing green animation loading screen
    });

    this.pages = [
      { title: 'Vendor of the Week', component: VoWPage },
      { title: 'Trending', component: TrendingPage },
      { title: 'Suggested', component: SuggestedPage },
    ];

  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

}
