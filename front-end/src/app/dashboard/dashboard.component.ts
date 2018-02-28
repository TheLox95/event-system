import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  logOut() {
    sessionStorage.removeItem('token');
    this._router.navigate(['/']);
  }

  gotToEventForm() {
    this._router.navigate(['/newEvent']);
  }

}
