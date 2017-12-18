import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RegisterGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.hasToken().switchMap(bool => {
      if (bool) {
        this.router.navigateByUrl('');
        return Observable.of(false);
      }
      return Observable.of(true);
    });
  }
}
