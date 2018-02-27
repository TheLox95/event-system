import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class TokenService {

  constructor(private _http: HttpClient) { }

  get() {
    return this._http.get(`http://localhost:3000/app/token`);
  }

}
