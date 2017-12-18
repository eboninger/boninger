import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthService implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  hasToken(): Observable<boolean> {
    return this.http.get('api/authorize').switchMap(res => {
      return Observable.of(res === true);
    });
  }
}
