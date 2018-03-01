import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventInterface } from './EventInterface';
import User from '../user/User';

@Injectable()
export class EventService {

  constructor(private _http: HttpClient) { }

  post(event: EventInterface) {
    console.log(event);
    return this._http.post(`http://localhost:3000/api/events/new`, event);
  }

  get(user: User) {
    return this._http.get(`http://localhost:3000/api/events/${user._id}`).map((res: {body: any}) => (res.body));
  }

}
