import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';

@Injectable()
export class CountdownService {
    constructor() {}

    getTimer(endTime: Date): Observable<string> {
        return Observable.interval(1000).map(_ => {
            const now = new Date().getTime();
            const distance = endTime.getTime() - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            return `${days.toString()}:${hours.toString()}:${minutes.toString()}:${seconds.toString()}`;
        });
    }
}
