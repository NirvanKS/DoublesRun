import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
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
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../providers/network/network';
import { Http, Headers } from '@angular/http';
import { ApiProvider } from '../providers/api/api';


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
  imageUrl: any;
  validateGeoLoc: boolean = false;
  successValidate: boolean = false;
  notFound: boolean = true;
  confirmVend: boolean = false;
  mark: any;
  currGeoLocLat: number;
  currGeoLocLong: number;
  vendorFormName: string;
  apiUrl = "https://dream-coast-60132.herokuapp.com/";

  vendorForm = {
    Type: true,
    Name: '',
    Description: '',
    locLat: 0,
    locLong: 0,
    pic: ''
  }

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public settings: ThemeSettingsProvider, public menuCtrl: MenuController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public storage: Storage, public loginProvider: LoginProvider, public events: Events, public network: Network,
    public networkProvider: NetworkProvider, private cache: CacheService, public api: ApiProvider, private http: Http) {

    this.listenToLoginEvents();
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val;
    });

    this.presentLoading();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      cache.setDefaultTTL(60 * 60 * 6); //cached data valid for 6 hours, could decrease or increase depending on what we want
      cache.setOfflineInvalidate(false);   // Keep our cached results when device is offline
      console.log(this.network.type, "  -network type");
      this.networkProvider.initializeNetworkEvents();
      this.listenToNetworkEvents()

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

  loginUser() {
    this.loginProvider.login();
  }

  listenToLoginEvents() {
    console.log("currently - ", this.isLoggedIn);
    this.events.subscribe('user:login', (imageUrl) => {
      this.isLoggedIn = true;
      console.log(imageUrl);
      this.imageUrl = imageUrl;
      console.log("WOW logged in should be true!! so ", this.isLoggedIn);
    });

    this.events.subscribe('user:logout', () => {
      this.isLoggedIn = false;
    });
  }

  listenToNetworkEvents() {
    this.events.subscribe('network:offline', () => {
      console.log('network:offline');
      this.networkProvider.isOnline = false;
    });

    // Online event
    this.events.subscribe('network:online', async () => {
      console.log('network:online');
      this.networkProvider.isOnline = true;
      this.vendorForm = await this.cache.getItem("vendorData");

      if (this.vendorForm.locLat != 0 && this.vendorForm.locLong != 0) {
        this.validateGeoLoc = true;
        if ((this.vendorForm.pic != '') && (this.vendorForm.Name != '') && (this.vendorForm.Description != '')) {
          this.successValidate = true;
        }
      }
      if (this.successValidate == false && this.validateGeoLoc == true) {
        this.failValidateToast();
      }
      else if (this.successValidate == false && this.validateGeoLoc == false) {
        this.GeoToast();
      }
      else {
        /*if Vendor Info is NOT in the Database (the Vendoris legit and does NOT exist yet){
          this.confirmVend = true;
          this.dismiss();
          this.confirmVend = false;
        }
        else if Vendor Info is ALREADY in the database ( the vendor already exists)
        {
          this.dismiss();
        }
        */
        this.checkForVendorDuplicates().subscribe((data: Object) => {
          //this.markers = data;
          this.mark = Object.values(data);
          this.mark.forEach(element => {
            if (element.locLong <= (this.currGeoLocLong + 0.09) || element.locLong >= (this.currGeoLocLong - 0.09)) {

              if (element.locLat <= (this.currGeoLocLat + 0.09) || element.locLat >= (this.currGeoLocLat - 0.09)) {

                if (element.Name == this.vendorFormName) {
                  console.log("Same Name Found!" + element.Name);
                  this.notFound = false;
                }
              }
              //
            }
          })
          if (this.notFound == true) {
            this.addVendor();
            this.presentSuccessToast();
          }
          else {
            this.presentFailToast()
          }

        });;


        this.confirmVend = true;
      }
    });
  }
  addVendor() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //this.http.post('http://127.0.0.1:8000/vendors/', JSON.stringify(this.vendorForm), { headers: headers })
    this.http.post(this.apiUrl + 'vendors/', JSON.stringify(this.vendorForm), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);


      })
  }

  checkForVendorDuplicates(): any {
    //return this.http.get('http://127.0.0.1:8000/vendors/').map(res => res.json());
    return this.http.get(this.apiUrl + 'vendors/').map(res => res.json());
    /*
    if(this.notFound == false)
    {
      return false;
    }
    return true;
    */
  }

  presentFailToast() {
    let toast = this.toastCtrl.create({
      message: 'Vendor already exists!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  presentSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Vendor added! Refresh the map!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  failValidateToast() {
    let toast = this.toastCtrl.create({
      message: 'All fields required!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  GeoToast() {
    let toast = this.toastCtrl.create({
      message: 'Please turn on location services!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }



}
