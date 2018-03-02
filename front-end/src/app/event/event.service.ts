import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventInterface } from './EventInterface';
import User from '../user/User';
import { Invitation, IsGoingState } from './invitation';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

@Injectable()
export class EventService {
  private _servicesMap = new Map();

  constructor(private _http: HttpClient) { }

  post(event: EventInterface) {
    console.log(event);
    const formData: FormData = new FormData();

    if (event.image instanceof File) {
      formData.append('fileKey', event.image, event.image.name);
    }
    formData.append('event', JSON.stringify(event));
    return this._http.post(`http://localhost:3000/api/events/new`, formData);
  }

  image(event_name: string) {
    return new Observable((observer: Subscriber<string>) => {
      let objectUrl: string = null;

      this._http
            .get(`http://localhost:3000/api/events/image/${event_name}`, {
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

  get(user: User) {
    if (this._servicesMap.has(user._id) === true) {
      return Observable.of(this._servicesMap.get(user._id));
    }
    return this._http.get(`http://localhost:3000/api/events/${user._id}`).map(res => {
      this._servicesMap.set(user._id, res);
      return res;
    });
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
