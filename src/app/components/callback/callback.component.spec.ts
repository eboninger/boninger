import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../auth/auth.service';
import { CallbackComponent } from './callback.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { FragmentService } from './../../services/fragment.service';

describe('CallbackComponent', () => {
  class AuthServiceStub {
    authenticated = false;
    setAuthenticated(val: boolean): void {
      this.authenticated = val;
    }
  }

  class ActivatedRouteStub {
    fragment: Observable<string> = Observable.of('initialRetVal');
  }

  class RouterStub {
    navigateByUrl(url: string) {
      return url;
    }
  }

  class FragmentServiceStub {
    parseFragment(frag: string): { [param: string]: string } {
      const params = frag.split('&');
      const paramsMap = params.map(param => param.split('='));
      return paramsMap.reduce((prev, cur) => (!!cur[0] ? { [cur[0]]: cur[1], ...prev } : prev), {});
    }
  }

  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;
  let routerSpy: any;
  let authSpy: any;
  let fragSpy: any;
  let router: Router;
  let route: ActivatedRoute;
  let authService: AuthService;
  let fragService: FragmentService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CallbackComponent],
        providers: [
          { provide: AuthService, useClass: AuthServiceStub },
          { provide: Router, useClass: RouterStub },
          { provide: ActivatedRoute, useClass: ActivatedRouteStub },
          { provide: FragmentService, useClass: FragmentServiceStub }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    const store = {};
    spyOn(localStorage, 'getItem').and.callFake(key => store[key]);
    spyOn(localStorage, 'setItem').and.callFake((key, val) => (store[key] = val));
    spyOn(localStorage, 'removeItem').and.callFake(key => delete store[key]);
    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    route = fixture.debugElement.injector.get(ActivatedRoute);
    authService = fixture.debugElement.injector.get(AuthService);
    fragService = fixture.debugElement.injector.get(FragmentService);
    routerSpy = spyOn(router, 'navigateByUrl').and.callThrough();
    authSpy = spyOn(authService, 'setAuthenticated').and.callThrough();
    fragSpy = spyOn(fragService, 'parseFragment').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to register if user is not authenticated', () => {
    fixture.detectChanges();
    expect(router.navigateByUrl).toHaveBeenCalledWith('register');
  });

  it('should set authenticated to true if callback has proper query params, navigate to home, and update local storage', () => {
    const fakeData = 'access_token=token&expires_in=3600';
    route.fragment = Observable.of(fakeData);
    fixture.detectChanges();
    expect(fragService.parseFragment).toHaveBeenCalledWith(fakeData);
    expect(authService.setAuthenticated).toHaveBeenCalledWith(true);
    expect(router.navigateByUrl).toHaveBeenCalledWith('');
    expect(localStorage.getItem('access_token')).toBe('token');
    let storeExpTimeExists = !!localStorage.getItem('expires_at');
    expect(storeExpTimeExists).toBe(true);
  });
});
