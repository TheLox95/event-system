import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventInterface } from './EventInterface';
import User from '../user/User';
import { Invitation, IsGoingState } from './invitation';

@Injectable()
export class EventService {

  constructor(private _http: HttpClient) { }

  post(event: EventInterface) {
    console.log(event);
    return this._http.post(`http://localhost:3000/api/events/new`, event);
  }

  get(user: User) {
    return this._http.get(`http://localhost:3000/api/events/${user._id}`);
  }

  invitate(invitation: Invitation) {
    return this._http.post(`http://localhost:3000/api/rsvp/invitate`, {
      event_id: invitation.event._id,
      user_id: invitation.user._id,
      is_going: invitation.is_going
    });
  }

  invitations(user: User) {
    return this._http.get(`http://localhost:3000/api/rsvp/invitations/${user._id}`);
  }

  responceInvitation(invitation: Invitation, res: IsGoingState) {
    return this._http.put(`http://localhost:3000/api/rsvp/response/`, {
      id: invitation._id,
      res: res
    }, {withCredentials: true});
  }

}
