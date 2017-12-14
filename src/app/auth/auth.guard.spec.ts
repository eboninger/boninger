import { TestBed, async, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  class AuthServiceStub {
    authenticated = false;
  }

  class RouterStub {
    navigate(route: Array<string>) {
      return route[0];
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: Router, useClass: RouterStub }
      ]
    });
  });

  it(
    'should navigate to register and return false if user is not authenticated ',
    inject([AuthGuard], (guard: AuthGuard) => {
      expect(guard).toBeTruthy();
    })
  );
});
