import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let routerSpy: any;
  let router: Router;
  let authService: AuthService;

  class AuthServiceStub {
    authenticated = false;
  }

  class RouterStub {
    navigateByUrl(url: string) {
      return url;
    }
  }

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [RegisterComponent],
        providers: [{ provide: Router, useClass: RouterStub }, { provide: AuthService, useClass: AuthServiceStub }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    authService = fixture.debugElement.injector.get(AuthService);
    routerSpy = spyOn(router, 'navigateByUrl').and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home if user is authenticated', () => {
    authService.authenticated = true;
    fixture.detectChanges();
    expect(router.navigateByUrl).toHaveBeenCalledWith('');
  });

  it('should remain on page if user is not authenticated', () => {
    authService.authenticated = false;
    expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
  });
});
