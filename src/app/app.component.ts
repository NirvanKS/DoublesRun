import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { VoWPage } from '../pages/vo-w/vo-w';
import { TrendingPage } from '../pages/trending/trending';
import { SuggestedPage } from '../pages/suggested/suggested';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, component: any}>;

  rootPage:any = TabsPage;
  

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      { title: 'Vendor of the Week', component: VoWPage },
      { title: 'Trending', component: TrendingPage },
      { title: 'Suggested', component: SuggestedPage }
    ];
  
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

}
