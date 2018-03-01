import { UserService } from './../user/user.service';
import { EventService } from './../event/event.service';
import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import User from '../user/User';
import { EventInterface } from '../event/EventInterface';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  msg;

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _eventService: EventService,
    private _userService: UserService
  ) {}

  events$: Observable<any>;
  invitations$: Observable<any>;

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
    this.events$ = this._eventService.get(user);
    this.invitations$ = this._eventService.invitations(user);
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
