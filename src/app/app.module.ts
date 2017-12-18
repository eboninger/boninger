import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [AppComponent, NavComponent, RegisterComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule.forRoot(), HttpClientModule],
  providers: [AuthService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {}
