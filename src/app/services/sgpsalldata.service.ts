import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SgpsalldataService {
  private fisturl = './webservice?token=generateAccessToken';
  private secondUrl = './webservice?token=getERPVehicleData';

  urldata = "https://script.google.com/macros/s/AKfycbyRKfCwmao0rGo844PW3N0pnzMuAdAN3_3D2LOwd_X5iNkEthLc-_cGNbQn33J4ZOlofA/exec";


  dtl: any;

  getData2() {
    this.http.get<any>(this.urldata).subscribe(
      res => {
        if (res && res.length > 0) {
          this.dtl = res[0]; // ✅ first object ko assign karo

          this.getToken(); // ab username/password exist karenge
        } else {
          console.error("No data received from urldata:", res);
        }
      },
      error => {
        console.error("Failed to fetch dtl:", error);
      }
    );
  }





  // Token subject to hold and update token in real-time
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    const savedToken = sessionStorage.getItem('jwtToken');
    if (savedToken) {
      this.tokenSubject.next(savedToken);
    }
  }

  /** Method to get live token anywhere in app */
  get token$() {
    return this.tokenSubject.asObservable();
  }



  /** Method to fetch new token */
  getToken(): void {

    const body = {
      username: this.dtl.username,
      password: this.dtl.password
    };

    this.http.post<any>(this.fisturl, body).subscribe(
      res => {
        const token = res?.token || res?.accessToken || res?.data?.token || '';
        if (token) {
          sessionStorage.setItem('jwtToken', token);
          this.tokenSubject.next(token); // Update token liv
          this.getData(); // Fetch data after token update
        } else {
          console.error('Token not found in response:', res);
        }
      },
      error => {
        console.error('Failed to fetch token:', error);
      }
    );
  }

  /** Method to get ERP data using live token */
  getData(): Observable<any> {
    const currentToken = this.tokenSubject.value;

    if (!currentToken) {
      console.error('Token is not available. Please fetch token first.');
      return new Observable(observer => {
        observer.error('Token missing');
      });
    }

    const headers = new HttpHeaders({
      'auth-code': currentToken
    });

    return this.http.post<any>(this.secondUrl, {}, { headers });
  }










}
