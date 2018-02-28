import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private _http: HttpClient) { }

  postUser(username, password) {
    return this._http.post(`http://localhost:3000/login/`, {username, password}, {responseType: 'json'});
  }

  getCurrent() {
    return this._http.get(`http://localhost:3000/api/users/current`);
  }

}
