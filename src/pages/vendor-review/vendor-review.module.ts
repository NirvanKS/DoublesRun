import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorReviewPage } from './vendor-review';

@NgModule({
  declarations: [
    VendorReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorReviewPage),
  ],
})
export class VendorReviewPageModule {}
