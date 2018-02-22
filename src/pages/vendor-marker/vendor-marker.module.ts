import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorMarkerPage } from './vendor-marker';

@NgModule({
  declarations: [
    VendorMarkerPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorMarkerPage),
  ],
})
export class VendorMarkerPageModule {}
