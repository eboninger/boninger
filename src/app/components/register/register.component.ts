import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private isAuthenticated: boolean;
  constructor(private router: Router, private authService: AuthService, private cookieService: CookieService) {
    this.authService.hasToken().subscribe(res => (this.isAuthenticated = res));
  }

  ngOnInit() {
    if (this.isAuthenticated) {
      this.router.navigateByUrl('');
    }
  }
}
