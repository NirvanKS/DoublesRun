import { Component, ViewChild, ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import {
//   GoogleMaps,
//   GoogleMap,
//   GoogleMapsEvent,
//   GoogleMapOptions,
//   CameraPosition,
//   MarkerOptions,
//   Marker
//  } from '@ionic-native/google-maps';
 declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  map: any;
  @ViewChild('map') mapElement: ElementRef;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }
  loadMap(){
 
    let latLng = new google.maps.LatLng(10.640997, -61.400261);
 
    let mapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  // loadMap() {

  //   let mapOptions: GoogleMapOptions = {
  //     camera: {
  //       target: {
  //         lat: 43.0741904,
  //         lng: -89.3809802
  //       },
  //       zoom: 18,
  //       tilt: 30
  //     }
  //   };

  //   this.map = GoogleMaps.create('map_canvas', mapOptions);

  //   // Wait the MAP_READY before using any methods.
  //   this.map.one(GoogleMapsEvent.MAP_READY)
  //     .then(() => {
  //       console.log('Map is ready!');

  //       // Now you can use all methods safely.
  //       this.map.addMarker({
  //           title: 'Ionic',
  //           icon: 'blue',
  //           animation: 'DROP',
  //           position: {
  //             lat: 43.0741904,
  //             lng: -89.3809802
  //           }
  //         })
  //         .then(marker => {
  //           marker.on(GoogleMapsEvent.MARKER_CLICK)
  //             .subscribe(() => {
  //               alert('clicked');
  //             });
  //         });

  //     });
  //   }
}
