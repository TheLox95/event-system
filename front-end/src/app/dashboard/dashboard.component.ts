import { Invitation } from './../event/invitation';
import { UserService } from './../user/user.service';
import { EventService } from './../event/event.service';
import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import User from '../user/User';
import { EventInterface } from '../event/EventInterface';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  msg;

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _eventService: EventService,
    private _userService: UserService
  ) {}

  events: EventInterface[];
  invitations: Invitation[];

  ngOnInit() {
    this._activeRoute.queryParamMap
      .map((params: Params) => params.params)
      .subscribe(params => {
        if (params) {
          this.msg = params;
        }
      });

      this.getUser().subscribe(this.afterUser);

  }

  private readonly afterUser = (user: User) => {
    this._eventService.get(user).subscribe(serverRes => {
      if (serverRes['error'] === true) {
        this.msg = serverRes['body'];
        return;
      }
      this.events = serverRes['body'];
    });
    this._eventService.invitations(user).subscribe(serverRes => {
      if (serverRes['error'] === true) {
        this.msg = serverRes['body'];
        return;
      }
      this.invitations = serverRes['body'];
    });
  }

  private getUser() {
    return this._userService.getCurrent();
  }

  editEvent(event_id) {
    this._router.navigate(['/eventEditor'], {queryParams: {event: event_id}});
  }

  logOut() {
    sessionStorage.removeItem('token');
    this._router.navigate(['/']);
  }

  gotToEventForm() {
    this._router.navigate(['/newEvent']);
  }
}
