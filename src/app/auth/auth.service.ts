import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AUTH_CONFIG } from './auth-config';
import { Router } from '@angular/router';
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  authData = {
    ClientId: AUTH_CONFIG.CLIENT_ID, // Your client id here
    AppWebDomain: AUTH_CONFIG.CLIENT_DOMAIN,
    TokenScopesArray: AUTH_CONFIG.SCOPE,
    RedirectUriSignIn: AUTH_CONFIG.REDIRECT_SIGN_IN,
    RedirectUriSignOut: AUTH_CONFIG.REDIRECT_SIGN_OUT
  };
  auth = new CognitoAuth(this.authData);
  public authenticated: boolean;
  private authenticated$: BehaviorSubject<boolean>;

  constructor(private router: Router) {
    this.authenticated$ = new BehaviorSubject<boolean>(!!localStorage.getItem('access_token'));
    this.authenticated$.subscribe(val => (this.authenticated = val));
  }

  setAuthenticated(isAuthenticated: boolean): void {
    this.authenticated$.next(isAuthenticated);
  }

  login() {
    // Auth0 authorize request
    this.auth.getSession();
  }

  logout() {
    // Remove tokens and profile and update login status subject
    this.auth.signout();
    this.authenticated$.next(false);
  }
}
