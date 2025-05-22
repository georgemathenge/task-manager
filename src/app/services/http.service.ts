import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
// import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    this.httpHeaders = new HttpHeaders().set(
    //     {

    //   'Authorization': 'Bearer ' + this.getAccessToken(),
    //   "Access-Control-Allow-Origin":"http://192.168.100.7:4200",
    //   "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    //   'Token': 'Bearer ' + this.getAccessToken()
    // }
      'Authorization',
      'Bearer ' +
        'Q3R1FuO2pM4Wp4coz5Jh0WrcV5B671gIgi9Otmx7Eu4yel14wwO91OyfWfjciOko'
    );
  }

  post(url: string, body: any): Observable<any> {
    return this.http
      .post(url, body, {
        headers: this.httpHeaders,
        observe: 'body',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An unknown error occurred!';
          // Check if the error is a server-side error
          if (error.status === 404) {
            errorMessage = 'Not Found (404)';
          } else if (error.status === 500) {
            errorMessage = 'Internal Server Error (500)';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          // You can also log or handle different error statuses here
          return throwError(errorMessage); // Pass the error message to the component
        })
      );
  }
  get<T>(url: string): Observable<T> {
    return this.http
      .get<T>(url, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An unknown error occurred!';
          if (error.status === 404) {
            errorMessage = 'Not Found (404)';
          } else if (error.status === 500) {
            errorMessage = 'Internal Server Error (500)';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
