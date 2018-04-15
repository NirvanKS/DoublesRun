import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuggestedPage } from './suggested';
import { LoginProvider } from '../../providers/login/login';

@NgModule({
  declarations: [
    SuggestedPage,
  ],
  imports: [
    IonicPageModule.forChild(SuggestedPage),
  ],
})
export class SuggestedPageModule {
  suggestions:any;
  constructor(public loginProvider: LoginProvider){
    this.suggestions = loginProvider.suggestions;
  }


}
