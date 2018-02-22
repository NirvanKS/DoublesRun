import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorModalPage } from './vendor-modal';

@NgModule({
  declarations: [
    VendorModalPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorModalPage),
  ],
})
export class VendorModalPageModule {}
