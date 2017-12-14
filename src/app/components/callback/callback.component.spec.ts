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
    retVal = 'initialRetVal';
    fragment: Observable<string> = Observable.of(this.retVal);
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
