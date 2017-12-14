import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from './../../auth/auth.service';
import { Router } from '@angular/router';
import { NavComponent } from './nav.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('NavComponent', () => {
  class RouterStub {
    navigateByUrl(url: string) {
      return url;
    }
  }

  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let authService: AuthService;
  let de: DebugElement;
  let el: HTMLElement;
  let authenticated = false;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [NavComponent],
        providers: [AuthService, { provide: Router, useClass: RouterStub }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    de = fixture.debugElement.query(By.css('nav'));
    el = !!de ? de.nativeElement : undefined;
    spyOn(authService, 'authenticated').and.returnValue(authenticated);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show when authenticated is false', () => {
    expect(el).toBe(undefined);
  });

  it('should show when authenticated is true', () => {
    authenticated = true;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('nav'));
    el = !!de ? de.nativeElement : undefined;
    expect(el.hidden).toBe(false);
  });
});
