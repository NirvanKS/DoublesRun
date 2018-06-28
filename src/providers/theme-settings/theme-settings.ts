import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
/*
  Generated class for the ThemeSettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ThemeSettingsProvider {
  private theme: BehaviorSubject<String>;
  isDark = false;
  reloadMap = false;

  constructor() {
    //this.theme = new BehaviorSubject('dark-theme');
    this.theme = new BehaviorSubject('light-theme');
  }

  setActiveTheme(val) {
    console.log("Setting the theme");
    this.theme.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }

  nightSwitchMapReload() {
    this.reloadMap = true;
  }


}
