import { Component, ViewChild, ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { VendorMarkerPage } from '../vendor-marker/vendor-marker';
import { Geolocation } from '@ionic-native/geolocation';
import{VendorModalPage} from '../vendor-modal/vendor-modal';
import{VendorAddPage} from '../vendor-add/vendor-add';

 declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  map: any;
  geoNumberLat: number = 0;
  geoNumberLon: number = 0;
  geoLatLon: any;
  modalParam = 'https://google.com/';
  @ViewChild('map') mapElement: ElementRef;
  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }
 

  loadNextPage(){
    this.navCtrl.push(VendorMarkerPage);
  }

  openModalWithParams() {
    let myModal = this.modalCtrl.create(VendorModalPage, { 'myParam': this.modalParam });
    myModal.present();
  }



  addMarker(){
    //this.navCtrl.push(VendorMarkerPage);
    //var geoNum = this.geoNumber;
    let modalVendorAdd = this.modalCtrl.create(VendorAddPage, { 'geoNumberLat': this.geoNumberLat, 'geoNumberLon': this.geoNumberLon});
    modalVendorAdd.onDidDismiss(data => {
      
          if(data.confirm ===true){
            console.log("hi");
            console.log(data);
            let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: this.geoLatLon//this.map.getCenter()
              
            });

            marker.addListener('click', function() {
              //navControl.push(VendorMarkerPage);
              //alert(content);
              var vendorModal = modal.create(VendorModalPage, { 'myParam': params });
              vendorModal.present();
            });
          }
    });
    modalVendorAdd.present();
    /*
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
      
    });*/
    
    let xd = "test";
    let content = "<h4>Sauce Doubles "+xd+"\</h4> <br>  <h1>5 Eastern Main Road<h1> <br> <h2>4/5 Stars<h2> "; 
    var map = this.map;
    var navControl = this.navCtrl;
    //var openModal = this.openModalWithParams;
    var modal = this.modalCtrl;
    var params = this.modalParam;
    /*
    marker.addListener('click', function() {
      //navControl.push(VendorMarkerPage);
      //alert(content);
      var vendorModal = modal.create(VendorModalPage, { 'myParam': params });
      vendorModal.present();
    });*/
        
   
    //this.addInfoWindow(marker, content);
   
  }

 

loadMap(){
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.geoLatLon = latLng;
      this.geoNumberLat = position.coords.latitude;
      this.geoNumberLon = position.coords.longitude;
      let mapOptions = {
        center: latLng,
        zoom: 15,
        minZoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      // Bounds for Trinidad
      var strictBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(10.150, -61.564), 
        new google.maps.LatLng(10.737, -61.11)
      );

      var center;
      // Listen for the dragend event
      var map = this.map;
      this.map.addListener('dragend', function() {
        var center = map.getCenter();
        if (strictBounds.contains(center)) return;
        console.log("outta here");
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
      });
    }, (err) => {
      console.log(err);
    });

    
  }


 
}
