import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
import { VoWPage } from '../pages/vo-w/vo-w';
import { TrendingPage } from '../pages/trending/trending';
import { SuggestedPage } from '../pages/suggested/suggested';
import { HomePage } from '../pages/home/home';
import { RankingsPage } from '../pages/rankings/rankings';
import { CacheService } from "ionic-cache";
import { timer } from 'rxjs/observable/timer';
import { ThemeSettingsProvider } from '../providers/theme-settings/theme-settings';
import { MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { LoginProvider } from '../providers/login/login'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  showSplash = true;
  pages: Array<{ title: string, component: any }>;
  selectedTheme: String;
  rootPage: any = TabsPage;
  loader: any;
  public ionicNamedColor: string = 'danger';
  isLoggedIn = false;
  nightMode = false;

  constructor(platform: Platform, cache: CacheService, statusBar: StatusBar, splashScreen: SplashScreen, public settings: ThemeSettingsProvider, public menuCtrl: MenuController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public storage: Storage, public loginProvider: LoginProvider) {
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val;
    });

    this.presentLoading();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      cache.setDefaultTTL(60 * 60 * 6); //cached data valid for 6 hours, could decrease or increase depending on what we want
      cache.setOfflineInvalidate(false);   // Keep our cached results when device is offline
      statusBar.styleDefault();
      splashScreen.hide();
      //timer(3000).subscribe(() => this.showSplash = false) removing green animation loading screen

      this.storage.get('introShown').then((result) => {

        if (result) {
          // this.rootPage = TabsPage;
        } else {
          this.rootPage = IntroPage;
          this.storage.set('introShown', true);
        }

        this.loader.dismiss();

      });


    });

    this.pages = [
      { title: 'Vendor of the Week', component: VoWPage },
      { title: 'Trending', component: TrendingPage },
      { title: 'Suggested', component: SuggestedPage },
    ];

    //trying silent login so that the user doesn't always have to login every session
    this.loginProvider.silentLogin();
    this.isLoggedIn = this.loginProvider.isLoggedIn;
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  enableNight() {
    console.log("enabling night" + this.nightMode);
    this.settings.isDark = this.nightMode;
    // if (this.nightMode) this.settings.setActiveTheme('dark-theme');
    // else this.settings.setActiveTheme('light-theme');
    if (this.selectedTheme === 'dark-theme') {
      this.settings.setActiveTheme('light-theme');
    } else {
      this.settings.setActiveTheme('dark-theme');
    }

    if (this.ionicNamedColor === 'danger') {
      this.ionicNamedColor = 'dark'
    } else {
      this.ionicNamedColor = 'danger'
    }
    this.menuCtrl.close();
    this.reloadMapToast();

  }

  reloadMapToast() {
    let toast = this.toastCtrl.create({
      message: 'If you are currently watching the map you may have to refresh the map to see theme changes.',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  presentLoading() {

    this.loader = this.loadingCtrl.create({
      content: "Loading..."
    });

    this.loader.present();

  }

  logoutUser() {
    if (this.loginProvider.isLoggedIn == false) {
      let toast = this.toastCtrl.create({
        message: 'You are not currently logged in.',
        duration: 3000,
        position: 'bottom'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();

    }
    else {
      this.loginProvider.logout().then(res => {
        console.log("logged out");
        let toast = this.toastCtrl.create({
          message: 'Succesfully logged out.',
          duration: 3000,
          position: 'bottom'
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();
      });
    }
  }
}
