import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddVendorIntroPage } from './add-vendor-intro';

@NgModule({
  declarations: [
    AddVendorIntroPage,
  ],
  imports: [
    IonicPageModule.forChild(AddVendorIntroPage),
  ],
})
export class AddVendorIntroPageModule {}
