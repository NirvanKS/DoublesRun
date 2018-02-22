import { Component, ViewChild, ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VendorMarkerPage } from '../vendor-marker/vendor-marker';

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

  loadNextPage(){
    this.navCtrl.push(VendorMarkerPage);
  }

  addMarker(){
    //this.navCtrl.push(VendorMarkerPage);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
      
    });
    
    let content = "<h4>Sauce Doubles</h4> <br>  <h1>5 Eastern Main Road<h1> <br> <h2>4/5 Stars<h2> "; 
    var map = this.map;
    var navControl = this.navCtrl;

    


    
   
      

    marker.addListener('click', function() {
      //navControl.push(VendorMarkerPage);
      //alert(content);
      

    
    });
        
   
    //this.addInfoWindow(marker, content);
   
  }

}
