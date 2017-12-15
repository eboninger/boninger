import { Injectable, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService implements OnInit {
  constructor(private cookieService: CookieService) {}

  ngOnInit() {}

  hasToken() {
    console.log(this.cookieService.getAll());
    return !!this.cookieService.get('jwt-express');
  }
}
