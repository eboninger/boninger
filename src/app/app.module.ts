import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';

import { CountdownService } from './components/countdown-timer/countdown.service';

@NgModule({
    declarations: [AppComponent, CountdownTimerComponent],
    imports: [BrowserModule],
    providers: [CountdownService],
    bootstrap: [AppComponent]
})
export class AppModule {}
