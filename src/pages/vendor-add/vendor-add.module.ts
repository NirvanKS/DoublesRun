import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorAddPage } from './vendor-add';

@NgModule({
  declarations: [
    VendorAddPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorAddPage),
  ],
})
export class VendorAddPageModule {}
