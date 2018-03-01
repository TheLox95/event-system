import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor(
    private _router: Router
  ) {}

  ngOnInit() {}

  logOut() {
    sessionStorage.removeItem('token');
    this._router.navigate(['/']);
  }

  goToEventForm() {
    this._router.navigate(['/panel/newEvent']);
  }

  goHome() {
    this._router.navigate(['/panel']);
  }
}
