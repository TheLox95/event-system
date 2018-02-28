import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { TokenService } from './token.service';
import 'rxjs/add/operator/map';

@Injectable()
export class GuardService implements CanActivate {

  constructor(private _tokenService: TokenService) { }

  canActivate() {
    console.log('AuthGuard#canActivate called');
    return this._tokenService.get() === null ? false : true;
  }

}
