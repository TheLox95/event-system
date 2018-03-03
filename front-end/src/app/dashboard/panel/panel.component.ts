import {UserService} from '../../user/user.service';
import {EventService} from '../../event/event.service';
import {Params, ActivatedRoute,  Router} from '@angular/router';
import {EventInterface} from '../../event/EventInterface';
import { Component, OnInit } from '@angular/core';
import { Invitation, IsGoingState } from '../../event/invitation';
import User from '../../user/User';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html'
})
export class PanelComponent implements OnInit {
  msg;
  events: EventInterface[];
  invitations: Invitation[];
  closeResult: string;
  eventIndexToDelete: number;

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _eventService: EventService,
    private _userService: UserService,
    private modalService: NgbModal
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

  viewEvent(event_id) {
    this._router.navigate(['/panel/eventDetail'], {queryParams: {event: event_id}});
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

  updateInvitation(res: string, invitation: Invitation, index: number) {
    let enumValue: IsGoingState;

    if (res === 'accepted') {
      enumValue = IsGoingState.ACCEPTED;
    }

    if (res === 'declined') {
      enumValue = IsGoingState.DECLINED;
    }

    this._eventService.responceInvitation(invitation, enumValue).subscribe(() => {
      this.invitations[index].is_going = enumValue;
    }, console.log);
  }

  edit(id) {
    this._router.navigate(['/panel/eventEdit'], {queryParams: {'id': id}});
  }

  delete(index) {
    this._eventService.delete(this.events[index]).subscribe(res => {
      if (res['error'] === true) {
        this.msg = res['body'];
        return;
      }
      this.events = this.events.filter((item, indexItem) => indexItem !== index);
    });

  }

  open(content, index) {
    this.eventIndexToDelete = index;
    this.modalService.open(content).result
      .then((result) => {
        this.closeResult = `Closed with: ${result}`;
        if (result === 'OK') {
          this.delete(index);
        }
      });
  }

}
