import {UserService} from '../../user/user.service';
import {EventService} from '../../event/event.service';
import {Params, ActivatedRoute,  Router} from '@angular/router';
import {EventInterface} from '../../event/EventInterface';
import { Component, OnInit } from '@angular/core';
import { Invitation } from '../../event/invitation';
import User from '../../user/User';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  msg;
  events: EventInterface[];
  invitations: Invitation[];

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _eventService: EventService,
    private _userService: UserService
  ) {}

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
  private getUser() {
    return this._userService.getCurrent();
  }

  editEvent(event_id) {
    this._router.navigate(['/panel/eventEditor'], {queryParams: {event: event_id}});
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

}
