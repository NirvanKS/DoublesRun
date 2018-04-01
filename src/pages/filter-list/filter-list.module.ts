import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterListPage } from './filter-list';

@NgModule({
  declarations: [
    FilterListPage,
  ],
  imports: [
    IonicPageModule.forChild(FilterListPage),
  ],
})
export class FilterListPageModule {}
