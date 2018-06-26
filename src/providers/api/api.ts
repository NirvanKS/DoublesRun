
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CacheService } from 'ionic-cache';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  constructor(private http: Http, private cache: CacheService) {
  }
  url: "https://intense-dolphin-207823.appspot.com/"
}
