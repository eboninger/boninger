import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-callback',
  template: `
    <p>
      Loading...
    </p>
  `,
  styles: []
})
export class CallbackComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    let authenticated = false;
    this.route.fragment.subscribe(val => {
      const params = val.split('&');
      const paramsMap = params.map(param => param.split('='));
      paramsMap.map(map => {
        if (map[0] === 'expires_in') {
          const expTime = +map[1] * 1000 + Date.now();
          localStorage.setItem('expires_at', JSON.stringify(expTime));
        }

        if (map[0] === 'access_token') {
          authenticated = true;
          localStorage.setItem('access_token', map[1]);
          this.authService.setAuthenticated(true);
          this.router.navigateByUrl('');
        }
      });
      if (!authenticated) {
        alert('authenticate failed');
        this.router.navigateByUrl('register');
      }
    });
  }
}
