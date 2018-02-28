import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import User from './User';

@Injectable()
export class UserService {

  constructor(private _http: HttpClient) { }

  login(username, password) {
    return this._http.post(`http://localhost:3000/login/`, {username, password}, {responseType: 'json'});
  }

  getCurrent() {
    return this._http.get(`http://localhost:3000/api/users/current`).map(this.toUser);
  }

  private readonly toUser = (obj: Object) => {
    return new User(obj['username'], obj['firstName'], obj['lastName'], obj['_id']);
  }

  register(user: User) {
    const body = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password
    };

    return this._http.post(`http://localhost:3000/api/users/register`, {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password
    });
  }

}
