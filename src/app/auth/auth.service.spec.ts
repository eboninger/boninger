import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    let store = {};
    TestBed.configureTestingModule({
      providers: [AuthService]
    });

    spyOn(localStorage, 'getItem').and.callFake(key => store[key]);
    spyOn(localStorage, 'setItem').and.callFake((key, val) => (store[key] = val));
    spyOn(localStorage, 'removeItem').and.callFake(key => delete store[key]);
  });

  it(
    'should be created',
    inject([AuthService], (service: AuthService) => {
      expect(service).toBeTruthy();
    })
  );

  it(
    'should set authenticated to false initially',
    inject([AuthService], (service: AuthService) => {
      expect(service.authenticated).toBe(false);
    })
  );

  it(
    'should update authenticated to true after setAuthenticated is called',
    inject([AuthService], (service: AuthService) => {
      expect(service.authenticated).toBe(false);
      service.setAuthenticated(true);
      expect(service.authenticated).toBe(true);
    })
  );

  it(
    'should update authenticated to false after logout and clear two items from local storage',
    inject([AuthService], (service: AuthService) => {
      expect(service.authenticated).toBe(false);
      service.setAuthenticated(true);
      localStorage.setItem('access_token', 'val');
      localStorage.setItem('expires_at', 'val');
      spyOn(service.auth, 'signOut').and.returnValue(undefined);
      service.logout();
      expect(service.authenticated).toBe(false);
      expect(localStorage.getItem('access_token')).toBe(undefined);
      expect(localStorage.getItem('expires_at')).toBe(undefined);
    })
  );
});
