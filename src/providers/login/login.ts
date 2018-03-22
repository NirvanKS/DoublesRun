//import { HttpClient } from '@angular/common/http';
import { Injectable, Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GooglePlus } from '@ionic-native/google-plus'
/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()


export class LoginProvider {
  providers: [GooglePlus]
  constructor(private http: Http, private googlePlus: GooglePlus) {
    console.log('Hello LoginProvider Provider');
  }
  displayName: any;
  email: any;
  familyName: any;
  givenName: any;
  userId: any;
  imageUrl: any;

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

        let headers = new Headers();
        headers.append('Content-Type', 'application/json'); 
        //this.http.get('http://127.0.0.1:8000/users/'+this.userId+'/')
        this.http.get('https://doubles-run.herokuapp.com/users/'+this.userId+'/')
          .map(res=>res.json())
          .subscribe(data=>{},err=>{
            if (err.status == 404){
              let newuser = {id:this.userId, name:this.givenName+' '+this.familyName, email: this.email};
              //this.http.post('http://127.0.0.1:8000/users/'+this.userId+'/', JSON.stringify(newuser),{headers: headers})
              this.http.post('https://doubles-run.herokuapp.com/users/'+this.userId+'/', JSON.stringify(newuser),{headers: headers})
              .map(res => res.json())
              .subscribe(data => {
                console.log("httppost responsea:",data);
              });
            }
          });
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
      })
      .catch(err => console.error(err));
  }


}
