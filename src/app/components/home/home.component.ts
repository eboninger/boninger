import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tracks: Song[];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('/api/songs').subscribe((res: Array<Song>) => (this.tracks = res));
  }
}
