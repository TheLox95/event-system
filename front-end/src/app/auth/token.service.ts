import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class TokenService {

  constructor(private _http: HttpClient) { }

  get() {
    return sessionStorage.getItem('token');
  }

}
