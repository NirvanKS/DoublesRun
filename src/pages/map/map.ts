import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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
declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage implements AfterViewInit {
  ngAfterViewInit(): void {
    // this.loadMap();

  }
  selectedTheme: String
  cachedVendors: any;
  map: any;
  markers: Observable<any>[] = [];
  mark: any;
  geoNumberLat: number = 0;
  geoNumberLon: number = 0;
  geoLatLon: any;
  modalParam = 'https://google.com/';
  apiUrl = "https://dream-coast-60132.herokuapp.com/";
  @ViewChild('map') mapElement: ElementRef;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public geolocation: Geolocation, public modalCtrl: ModalController,
    private http: Http, public api: ApiProvider, public snaptomap: SnapToMapProvider, private cache: CacheService, ) {
  }
  ionViewWillEnter() {
    this.loadMap();
  }
  ionViewDidLoad() {
    //this.loadMap();

  }


  loadNextPage() {
    this.navCtrl.push(VendorMarkerPage);
  }

  openModalWithParams() {
    let myModal = this.modalCtrl.create(VendorModalPage, { 'myParam': this.modalParam });
    myModal.present();
  }



  addMarker() {
    this.geolocation.getCurrentPosition().then((position) => {
      console.log("got location?");
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.geoLatLon = latLng;
      this.geoNumberLat = position.coords.latitude;
      this.geoNumberLon = position.coords.longitude;
      map.setCenter(latLng);
      map.setZoom(15);
    });
    this.navCtrl.push(VendorAddPage, {
      geoNumberLat: this.geoNumberLat,
      geoNumberLon: this.geoNumberLon,

    });

    var map = this.map;
    var navControl = this.navCtrl;
    var modal = this.modalCtrl;
    var params = this.modalParam;


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

    let mapOptions = {
      center: new google.maps.LatLng(10.4568902, -61.2991011),
      zoom: 10.35,
      minZoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    let mapOptionsNight = {
      center: new google.maps.LatLng(10.4568902, -61.2991011),
      zoom: 10.35,
      minZoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: style
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptionsNight);
    // Bounds for Trinidad
    var strictBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(10.150, -61.564),
      new google.maps.LatLng(10.737, -61.11)
    );

    var center;
    // Listen for the dragend event
    var map = this.map;
    this.loadMarkers();
    if (this.snaptomap.shouldIBeVendorSnappo) {
      let latLng = new google.maps.LatLng(this.snaptomap.myLatParam, this.snaptomap.myLongParam);
      //this.navParams.get("myLatParam");
      map.setCenter(latLng);
      map.setZoom(15);
      this.snaptomap.shouldIBeVendorSnappo = false;
      //return; //optional? dont wanna have a gigantic else statement for the rest of this function tho
    }
    else {
      this.geolocation.getCurrentPosition().then((position) => {
        console.log("got location?");
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.geoLatLon = latLng;
        this.geoNumberLat = position.coords.latitude;
        this.geoNumberLon = position.coords.longitude;
        map.setCenter(latLng);
        map.setZoom(15);
      });
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
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: markLatLon//this.map.getCenter()

        });

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
    });
  }


  loadMarkers() {
    var Vmodal = this.modalCtrl;
    let url = 'https://dream-coast-60132.herokuapp.com/vendors/';
    this.cachedVendors = this.cache.loadFromObservable(url, this.http.get(this.apiUrl + 'vendors/').map(res => res.json()));
    if (this.cachedVendors != null) {
      console.log(this.cachedVendors);
      console.log("Loading from cache");
      this.loadFromCache(this.cachedVendors);
      return;
    }
    //this.http.get('http://127.0.0.1:8000/vendors/').map(res => res.json()).subscribe((data: Object) => {
    this.http.get(this.apiUrl + 'vendors/').map(res => res.json()).subscribe((data: Object) => {
      //this.markers = data;
      this.mark = Object.values(data);
      let x = 0;
      this.mark.forEach(element => {
        //console.log(element.Name);
        let markLatLon = new google.maps.LatLng(element.locLat, element.locLong);
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: markLatLon//this.map.getCenter()

        });

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


        //console.log(x);
        //console.log(element);
      })
      //console.log(data);
    });
  }





}
