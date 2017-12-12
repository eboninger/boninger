import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { CallbackComponent } from './components/callback/callback.component';
import { HomeComponent } from './components/home/home.component';

const appRoutes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: true })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
