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
  private _servicesMap: Map<'USER' | 'EVENT_ID', Map<string, ServerResponse>> = new Map();

  constructor(private _http: HttpClient) {
    this._servicesMap.set('USER', new Map());
    this._servicesMap.set('EVENT_ID', new Map());
   }

  post(event: EventInterface) {
    console.log(event);
    const formData: FormData = new FormData();

    if (event.image instanceof File) {
      formData.append('fileKey', event.image, event.image.name);
    }
    formData.append('event', JSON.stringify(event));
    return this._http.post(`http://localhost:3000/api/events/new`, formData);
  }

  image(event_id: string) {
    return new Observable((observer: Subscriber<string>) => {
      let objectUrl: string = null;

      this._http
            .get(`http://localhost:3000/api/events/image/${event_id}`, {
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
  const possibleEvent = this._servicesMap.get('EVENT_ID').get(id);

  if (possibleEvent !== undefined) {
    return Observable.of(possibleEvent);
  }
  return this._http.get<ServerResponse>(`http://localhost:3000/api/events/id/${id}`).map(res => {
    this._servicesMap.get('EVENT_ID').set(id, res);
    return res;
  });
}

  get(user: User) {
    const possibleEvent = this._servicesMap.get('USER').get(user._id);

    if (possibleEvent !== undefined) {
      return Observable.of(possibleEvent);
    }
    return this._http.get<ServerResponse>(`http://localhost:3000/api/events/${user._id}`).map(res => {
      this._servicesMap.get('USER').set(user._id, res);
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

  update(event: EventInterface) {
    const formData: FormData = new FormData();
    if (event.image instanceof File) {
      formData.append('fileKey', event.image, event.image.name);
    }
    formData.append('event', JSON.stringify(event));
    return this._http.put(`http://localhost:3000/api/events/update/`, formData);
  }

  delete(event: EventInterface) {
    return this._http.delete(`http://localhost:3000/api/events/delete/${event._id}`);
  }

  cancelInvitation(invitation: Invitation) {
    return this._http.delete(`http://localhost:3000/api/rsvp/cancel/${invitation._id}`);
  }

}
