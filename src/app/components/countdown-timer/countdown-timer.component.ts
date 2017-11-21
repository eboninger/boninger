import { Component, OnInit } from '@angular/core';
import { CountdownService } from './countdown.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-countdown-timer',
    templateUrl: './countdown-timer.component.html',
    styleUrls: ['./countdown-timer.component.css']
})
export class CountdownTimerComponent implements OnInit {
    timeLeft$: Observable<string>;

    constructor(private countdownService: CountdownService) {}

    ngOnInit() {
        this.timeLeft$ = this.countdownService.getTimer(new Date(2018, 3, 3, 5, 55, 55, 55));
    }
}
