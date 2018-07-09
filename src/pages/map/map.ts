import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, LoadingController } from 'ionic-angular';
import { VendorMarkerPage } from '../vendor-marker/vendor-marker';
import { Geolocation } from '@ionic-native/geolocation';
import { VendorModalPage } from '../vendor-modal/vendor-modal';
import { VendorAddPage } from '../vendor-add/vendor-add';
import { AfterViewInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ApiProvider } from '../../providers/api/api';
import { SnapToMapProvider } from '../../providers/snap-to-map/snap-to-map'
import { CacheService } from 'ionic-cache';
import { mapStyle } from './mapStyle';
import * as MarkerClusterer from 'node-js-marker-clusterer';
import { ThemeSettingsProvider } from '../../providers/theme-settings/theme-settings'
import { ToastController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network'
import { Network } from '@ionic-native/network';
declare var google;
declare var navigator;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage implements AfterViewInit {
  ngAfterViewInit(): void {
    // this.loadMap();
    //hi dweebs fed7
  }
  mapOptions: any;
  selectedTheme: String
  cachedVendors: any;
  map: any;
  markers = [];
  mark: any;
  geoNumberLat: number = 0;
  geoNumberLon: number = 0;
  geoLatLon: any;
  loader: any;
  modalParam = 'https://google.com/';
  apiUrl = "https://dream-coast-60132.herokuapp.com/";
  vendorsKey = "vendor-ranking-list";
  offline: Boolean;
  @ViewChild('map') mapElement: ElementRef;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public geolocation: Geolocation, public modalCtrl: ModalController,
    private http: Http, public api: ApiProvider, public snaptomap: SnapToMapProvider, private cache: CacheService, public settings: ThemeSettingsProvider,
    private toastCtrl: ToastController, public networkProvider: NetworkProvider, public network: Network, 
    public platform: Platform, public loadingCtrl: LoadingController) {
  }
  async ionViewWillEnter() {
    console.log("The network is currently type -", this.network.type);
    console.log("will enter - map.ts");
    this.markers = [];
    await this.platform.ready();
    if (this.networkProvider.isOnline == false && this.network.type == "none") {
      this.offline = true;
    }
    this.loadMap();
    console.log("network online?", this.networkProvider.isOnline);
    

  }
  ionViewDidLoad() {
    //this.loadMap();

  }

  refreshMap() {
    let key = 'https://dream-coast-60132.herokuapp.com/vendors/';
    this.cache.removeItem(key).then(x => {
      this.markers = [];
      this.loadMap();
    })

  }

  loadNextPage() {
    this.navCtrl.push(VendorMarkerPage);
  }

  openModalWithParams() {
    let myModal = this.modalCtrl.create(VendorModalPage, { 'myParam': this.modalParam });
    myModal.present();
  }

  addOfflineMarker() {
    let options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };
    this.presentLoading();
    console.log('im gonna try!');
    let watchLoc = this.geolocation.watchPosition(options)
      .subscribe((position) => {
        console.log(position);
        if (position.coords == undefined) {
          //this MIGHT mean timeout error, position becomes the error object if one occurs :)
          this.geolocationRebootError();
          console.log('Error getting location');
          this.loader.dismiss();
          watchLoc.unsubscribe();
          return;
        }
        console.log("trying my best here ", position.coords.accuracy, "m");
        if (position.coords.accuracy > 30) {
          return;
        }
        console.log("got location?", position.coords.accuracy, "m");
        this.geoNumberLat = position.coords.latitude;
        this.geoNumberLon = position.coords.longitude;
        if (this.geoNumberLat == 0 && this.geoNumberLon == 0) {
          this.geoLocationNotFoundToast();
        }
        else {
          watchLoc.unsubscribe();
          this.loader.dismiss();
          this.navCtrl.push(VendorAddPage, {
            geoNumberLat: this.geoNumberLat,
            geoNumberLon: this.geoNumberLon,
          });
        }
      }, (error: any) => { //errors aren't being picked up on watchPosition
        if (error.code == 3) {
          this.geolocationRebootError()
        }
        console.log('Error getting location', error);

      });

  }


  addMarker() {
    this.addOfflineMarker(); // sheer laziness btw

  }



  loadMap() {
    console.log("haHAAA fed7");
    // this.geolocation.getCurrentPosition().then((position) => {
    console.log("loading map...");
    // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    // this.geoLatLon = latLng;
    // this.geoNumberLat = position.coords.latitude;
    // this.geoNumberLon = position.coords.longitude;
    let style = mapStyle;
    if (this.settings.isDark == true) {
      this.mapOptions = {
        center: new google.maps.LatLng(10.4568902, -61.2991011),
        zoom: 10.35,
        minZoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: style
      }
    }
    else {
      this.mapOptions = {
        center: new google.maps.LatLng(10.4568902, -61.2991011),
        zoom: 10.35,
        minZoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    }


    this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
    // Bounds for Trinidad
    var strictBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(10.150, -61.564),
      new google.maps.LatLng(10.737, -61.11)
    );

    var center;
    // Listen for the dragend event
    var map = this.map;
    this.loadMarkers();

    // var markerCluster = new MarkerClusterer(this.map, this.markers,
    //   {imagePath: '../assets/imgs/cluster'});


    if (this.snaptomap.shouldIBeVendorSnappo) {
      let latLng = new google.maps.LatLng(this.snaptomap.myLatParam, this.snaptomap.myLongParam);
      //this.navParams.get("myLatParam");
      map.setCenter(latLng);
      map.setZoom(15);
      this.snaptomap.shouldIBeVendorSnappo = false;
      //return; //optional? dont wanna have a gigantic else statement for the rest of this function tho
    }
    else {
      let options= {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      };
      console.log('im gonna try!');
      let watchLoc = this.geolocation.watchPosition(options)
      .subscribe((position) =>{
        console.log(position);
        if(position.coords == undefined){
          //this MIGHT mean timeout error, position becomes the error object if one occurs :)
          this.geolocationRebootError();
          console.log('Error getting location');
          watchLoc.unsubscribe();
          return;
        }
        console.log("trying my best here ", position.coords.accuracy,"m");
        if (position.coords.accuracy>50){
          return;
        }
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log("got location?", position.coords.accuracy,"m");
        this.geoLatLon = latLng;
        this.geoNumberLat = position.coords.latitude;
        this.geoNumberLon = position.coords.longitude;
        let geoLoc = { "geoLat": this.geoNumberLat, "geoLong": this.geoNumberLon };
        this.cache.saveItem("geoLoc", JSON.stringify(geoLoc));
        if (this.geoNumberLat == 0 && this.geoNumberLon == 0) {
          this.geoLocationNotFoundToast();
        }
        else {
          map.setCenter(latLng);
          map.setZoom(15);
          var yourWindow = new google.maps.InfoWindow({
            content: '<p>You are here<p>'
          });
  
          var YourMarker = new google.maps.Marker({
            position: latLng,
            map: map,
            
            
          });
          this.markers.push(YourMarker);
          YourMarker.addListener('click', function() {
            yourWindow.open(map, YourMarker);
          });
          watchLoc.unsubscribe();
  
        }
      },(error:any) => { //errors aren't being picked up on watchPosition
        if (error.code==3){
          this.geolocationRebootError()
        }
        console.log('Error getting location', error);
        
      });
      
      // this.geolocation.getCurrentPosition(options).then((position) => {
        
      //   let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //   console.log("got location?", position.coords.accuracy,"m");
      //   this.geoLatLon = latLng;
      //   this.geoNumberLat = position.coords.latitude;
      //   this.geoNumberLon = position.coords.longitude;
      //   let geoLoc = { "geoLat": this.geoNumberLat, "geoLong": this.geoNumberLon };
      //   this.cache.saveItem("geoLoc", JSON.stringify(geoLoc));
      //   if (this.geoNumberLat == 0 && this.geoNumberLon == 0) {
      //     this.geoLocationNotFoundToast();
      //   }
      //   else {
      //     map.setCenter(latLng);
      //     map.setZoom(15);
      //     var yourWindow = new google.maps.InfoWindow({
      //       content: '<p>You are here<p>'
      //     });
  
      //     var YourMarker = new google.maps.Marker({
      //       position: latLng,
      //       map: map,
            
            
      //     });
      //     this.markers.push(YourMarker);
      //     YourMarker.addListener('click', function() {
      //       yourWindow.open(map, YourMarker);
      //     });
  
      //   }

      // }).catch((error) => {
      //   if (error.code==3){
      //     this.geolocationRebootError()
      //   }
      //   console.log('Error getting location', error);
        
      // });
    }
    this.map.addListener('dragend', function () {
      var center = map.getCenter();
      if (strictBounds.contains(center)) return;
      // out of bounds - Move the map back within the bounds

      var c = center,
        x = c.lng(),
        y = c.lat(),
        maxX = strictBounds.getNorthEast().lng(),
        maxY = strictBounds.getNorthEast().lat(),
        minX = strictBounds.getSouthWest().lng(),
        minY = strictBounds.getSouthWest().lat();

      if (x < minX) x = minX;
      if (x > maxX) x = maxX;
      if (y < minY) y = minY;
      if (y > maxY) y = maxY;

      map.setCenter(new google.maps.LatLng(y, x));

      // });

    }, (err) => {
      console.log(err);
    });
  }

  loadFromCache(vendorObservable: Observable<any>) {
    var Vmodal = this.modalCtrl;
    vendorObservable.subscribe((data: Object) => {
      //this.markers = data;
      this.mark = Object.values(data);
      let x = 0;
      this.mark.forEach(element => {
        //console.log(element.Name);
        let markLatLon = new google.maps.LatLng(element.locLat, element.locLong);
        let image = {
          url: "assets/imgs/doubles.png",
          size: new google.maps.Size(60, 47),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(30,47)
        }
        let marker = new google.maps.Marker({
          // map: this.map,
          icon: image,
          // animation: google.maps.Animation.DROP,
          position: markLatLon//this.map.getCenter()

        });
        this.markers.push(marker);

        marker.addListener('click', function () {
          //navControl.push(VendorMarkerPage);
          //alert(content);


          var vendorModal = Vmodal.create(VendorModalPage, {
            'name': element.Name,
            'description': element.Description, 'type': element.Type,
            'img': element.pic,
            'reviewList': element.reviews, 'avgRating': element.avgRating,
            'avgThickness': element.avgThickness, 'avgTime': element.avgTime,
            'avgCucumber': element.avgCucumber, 'avgSpicy': element.avgSpicy,
            'vendorID': element.id
          });
          vendorModal.present();
        });
      })
      var mcOptions = {
        gridSize: 25,
        minimumClusterSize: 2,
        imagePath: 'assets/imgs/cluster/m'
      };
      var markerCluster = new MarkerClusterer(this.map, this.markers, mcOptions);

    });
  }


  loadMarkers() {
    var Vmodal = this.modalCtrl;
    let url = 'https://dream-coast-60132.herokuapp.com/vendors/';
    console.log(this.cachedVendors);
    this.cachedVendors = this.cache.loadFromObservable(url, this.http.get(this.apiUrl + 'vendors/').map(res => res.json()));
    if (this.cachedVendors != null) {
      console.log(this.cachedVendors);
      console.log("Loading from cache");
      this.loadFromCache(this.cachedVendors);
      return;
    }

    // this.http.get('http://127.0.0.1:8000/vendors/').map(res => res.json()).subscribe((data: Object) => {
    this.http.get(this.apiUrl + 'vendors/').map(res => res.json()).subscribe((data: Object) => {
      //this.markers = data;
      this.mark = Object.values(data);
      let x = 0;
      this.mark.forEach(element => {
        //console.log(element.Name);
        let markLatLon = new google.maps.LatLng(element.locLat, element.locLong);
        let marker = new google.maps.Marker({
          // map: this.map,
          // icon: "assets/imgs/doubles.png",
          // animation: google.maps.Animation.DROP,
          position: markLatLon//this.map.getCenter()

        });
        this.markers.push(marker);
        marker.addListener('click', function () {
          //navControl.push(VendorMarkerPage);
          //alert(content);


          var vendorModal = Vmodal.create(VendorModalPage, {
            'name': element.Name,
            'description': element.Description, 'type': element.Type,
            'img': element.pic,
            'reviewList': element.reviews, 'avgRating': element.avgRating,
            'avgThickness': element.avgThickness, 'avgTime': element.avgTime,
            'avgCucumber': element.avgCucumber, 'avgSpicy': element.avgSpicy,
            'avgChanna': element.avgChanna,
            'vendorID': element.id
          });
          vendorModal.present();

        });




        //console.log(x);
        //console.log(element);
      })
      var mcOptions = {
        gridSize: 50,
        minimumClusterSize: 10,
        imagePath: 'assets/imgs/cluster/m'
      };
      var markerCluster = new MarkerClusterer(this.map, this.markers, mcOptions);

      //console.log(data);
    });
    // });





  }
  geoLocationNotFoundToast() {
    let toast = this.toastCtrl.create({
      message: 'Your geolocation was not loaded.',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  geolocationRebootError() {
    let toast = this.toastCtrl.create({
      message: "Can't get your location, try restarting your device!",
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
      content: "Getting your location..."
    });

    this.loader.present();

  }

}



