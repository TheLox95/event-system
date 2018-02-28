import { Component, OnInit } from '@angular/core';
import {Params, Router,  ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  msg;

  constructor(private _router: Router, private _activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this._activeRoute.queryParamMap
      .map((params: Params) => params.params)
      .subscribe( (params) => {
            if (params) {
              this.msg = params;
            }
        });
  }

  logOut() {
    sessionStorage.removeItem('token');
    this._router.navigate(['/']);
  }

  gotToEventForm() {
    this._router.navigate(['/newEvent']);
  }

}
