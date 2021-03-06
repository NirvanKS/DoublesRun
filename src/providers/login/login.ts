//import { HttpClient } from '@angular/common/http';
import { Injectable, Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { CacheService } from 'ionic-cache';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()


export class LoginProvider {
  providers: [GooglePlus]
  constructor(private http: Http, private cache: CacheService, private googlePlus: GooglePlus, public events: Events, public storage: Storage) {
    console.log('Hello LoginProvider Provider');
  }
  displayName: any;
  email: any;
  familyName: any;
  givenName: any;
  userId: any;
  imageUrl: any;
  suggestions: any = [];
  suggVendors: any = [];
  cachedVendors: any;

  isLoggedIn: boolean = false;

  login() {
    return this.googlePlus.login({})
      .then(res => {
        //console.log(res);
        this.displayName = res.displayName;
        this.email = res.email;
        this.familyName = res.familyName;
        this.givenName = res.givenName;
        this.userId = res.userId;
        this.imageUrl = res.imageUrl;
        this.isLoggedIn = true;

        console.log('User logged in!')
        this.events.publish('user:login', this.imageUrl);


        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //this.http.get('http://127.0.0.1:8000/users/'+this.userId+'/')
        this.http.get('https://dream-coast-60132.herokuapp.com/users/' + this.userId + '/')
          .map(res => res.json())
          .subscribe(data => {
            this.suggestions = data.suggestions;
            console.log("sugg", this.suggestions);
            if (this.suggestions.length != 0) {
              console.log("dis be suggestions", this.suggestions);
              this.storage.get('suggShown').then((result) => {

                if (result) {
                  // this.rootPage = TabsPage;
                } else {
                  this.events.publish('First Suggestions Available');
                  this.storage.set('suggShown', true);
                }

              });

            }
            this.cachedVendors.subscribe((data: Object) => {
              console.log(data)
              for (let i = 0; i < this.suggestions.length; i++) {
                let vend = (Object.values(data).find(element => element.id == this.suggestions[i]));
                this.suggVendors.push(vend);
                console.log("fwef", this.suggVendors, this.suggestions[i]);
              }
            })
          }, err => {
            if (err.status == 404) {
              let newuser = { id: this.userId, name: this.givenName + ' ' + this.familyName, email: this.email };
              //this.http.post('http://127.0.0.1:8000/users/'+this.userId+'/', JSON.stringify(newuser),{headers: headers})
              this.http.post('https://dream-coast-60132.herokuapp.com/users/', JSON.stringify(newuser), { headers: headers })
                .map(res => res.json())
                .subscribe(data => {
                  //fill suggestions for new user here maybe
                  console.log("httppost responsea:", data);
                });
            }
          });
        let url = 'https://dream-coast-60132.herokuapp.com/vendors/';
        this.cachedVendors = this.cache.loadFromObservable(url, this.http.get(url).map(res => res.json()));


      })
      .catch(err => {
        console.log(this.googlePlus.getSigningCertificateFingerprint());
        console.error(err);
      });
  }

  logout() {
    return this.googlePlus.logout()
      .then(res => {
        console.log(res);
        this.displayName = "";
        this.email = "";
        this.familyName = "";
        this.givenName = "";
        this.userId = "";
        this.imageUrl = "";

        this.isLoggedIn = false;
        console.log('User logged out!')
        this.events.publish('user:logout');
      })
      .catch(err => console.error(err));
  }

  silentLogin() {
    console.log("trying to silently logging in");
    this.googlePlus.trySilentLogin({}).then(res => {
      this.displayName = res.displayName;
      this.email = res.email;
      this.familyName = res.familyName;
      this.givenName = res.givenName;
      this.userId = res.userId;
      this.imageUrl = res.imageUrl;
      this.isLoggedIn = true;
      console.log('User logged in!')
      this.events.publish('user:login', this.imageUrl);
      console.log("finished silently logging in");

      let url = 'https://dream-coast-60132.herokuapp.com/vendors/';
      this.cachedVendors = this.cache.loadFromObservable(url, this.http.get(url).map(res => res.json()));

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      //this.http.get('http://127.0.0.1:8000/users/'+this.userId+'/')
      this.http.get('https://dream-coast-60132.herokuapp.com/users/' + this.userId + '/')
        .map(res => res.json())
        .subscribe(data => {
          this.suggestions = data.suggestions;
          console.log("sugg", this.suggestions);
          if (this.suggestions != []) {
            this.storage.get('suggShown').then((result) => {

              if (result) {
                // this.rootPage = TabsPage;
              } else {
                this.events.publish('First Suggestions Available');
                this.storage.set('suggShown', true);
              }

            });

          }
          this.cachedVendors.subscribe((data: Object) => {
            console.log(data)
            for (let i = 0; i < this.suggestions.length; i++) {
              let vend = (Object.values(data).find(element => element.id == this.suggestions[i]));
              this.suggVendors.push(vend);
              console.log("fwef", this.suggVendors, this.suggestions[i]);
            }
          })
        }, err => {
          if (err.status == 404) {
            let newuser = { id: this.userId, name: this.givenName + ' ' + this.familyName, email: this.email };
            //this.http.post('http://127.0.0.1:8000/users/'+this.userId+'/', JSON.stringify(newuser),{headers: headers})
            this.http.post('https://dream-coast-60132.herokuapp.com/users/', JSON.stringify(newuser), { headers: headers })
              .map(res => res.json())
              .subscribe(data => {
                //fill suggestions for new user here maybe
                console.log("httppost responsea:", data);
              });
          }
        });
    }).catch(err => console.error(err));

  }


}
