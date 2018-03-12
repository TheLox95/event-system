import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventInterface } from './EventInterface';
import User from '../user/User';
import { Invitation, IsGoingState } from './invitation';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

interface ServerResponse {error: boolean; success: boolean; body: any; }

@Injectable()
export class EventService {

  constructor(private _http: HttpClient) {}

  post(event: EventInterface) {
    console.log(event);
    const formData: FormData = new FormData();

    if (event.image instanceof File) {
      formData.append('fileKey', event.image, event.image.name);
    }
    formData.append('event', JSON.stringify(event));
    return this._http.post(`${environment.api_url}api/events/new`, formData);
  }

  image(event_id: string) {
    return new Observable((observer: Subscriber<string>) => {
      let objectUrl: string = null;

      this._http
            .get(`${environment.api_url}api/events/image/${event_id}`, {
                responseType: 'blob'
            })
          .subscribe(m => {
              objectUrl = URL.createObjectURL(m);
              observer.next(objectUrl);
          });

      return () => {
          if (objectUrl) {
              URL.revokeObjectURL(objectUrl);
              objectUrl = null;
          }
      };
  });

}

getById(id: string) {

  return this._http.get<ServerResponse>(`${environment.api_url}api/events/id/${id}`);
}

  get(user: User) {
    return this._http.get<ServerResponse>(`${environment.api_url}api/events/${user._id}`);
  }

  invitate(invitation: Invitation) {
    return this._http.post(`${environment.api_url}api/rsvp/invitate`, {
      event_id: invitation.event._id,
      user_id: invitation.user._id,
      is_going: invitation.is_going
    });
  }

  invitations(user: User) {
    return this._http.get(`${environment.api_url}api/rsvp/invitations/${user._id}`);
  }

  responceInvitation(invitation: Invitation, res: IsGoingState) {
    return this._http.put(`${environment.api_url}api/rsvp/response/`, {
      id: invitation._id,
      res: res
    }, {withCredentials: true});
  }

  update(event: EventInterface) {
    const formData: FormData = new FormData();
    if (event.image instanceof File) {
      formData.append('fileKey', event.image, event.image.name);
    }
    formData.append('event', JSON.stringify(event));
    return this._http.put(`${environment.api_url}api/events/update/`, formData);
  }

  delete(event: EventInterface) {
    return this._http.delete(`${environment.api_url}api/events/delete/${event._id}`);
  }

  cancelInvitation(invitation: Invitation) {
    return this._http.delete(`${environment.api_url}api/rsvp/cancel/${invitation._id}`);
  }

}
