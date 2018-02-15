import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RankingsPage } from './rankings';

@NgModule({
  declarations: [
    RankingsPage,
  ],
  imports: [
    IonicPageModule.forChild(RankingsPage),
  ],
})
export class RankingsPageModule {}
