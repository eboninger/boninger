import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth/auth.service';
import { FragmentService } from './../../services/fragment.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as aws from 'aws-sdk';

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
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fragmentService: FragmentService
  ) {}

  ngOnInit() {
    let authenticated = false;
    this.route.fragment.subscribe(val => {
      const paramsMap = this.fragmentService.parseFragment(val);
      if (paramsMap['expires_in']) {
        const expTime = +paramsMap['expires_in'] * 1000 + Date.now();
        localStorage.setItem('expires_at', JSON.stringify(expTime));
      }

      if (paramsMap['access_token']) {
        authenticated = true;
        localStorage.setItem('access_token', paramsMap['access_token']);
        this.authService.setAuthenticated(true);
        this.router.navigateByUrl('');
      }
      if (!authenticated) {
        this.router.navigateByUrl('register');
      }
    });
  }
}
