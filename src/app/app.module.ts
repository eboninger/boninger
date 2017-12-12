import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthService } from './auth/auth.service';
import { CallbackComponent } from './components/callback/callback.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [AppComponent, NavComponent, RegisterComponent, CallbackComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
