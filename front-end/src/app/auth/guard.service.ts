import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from './token.service';
import 'rxjs/add/operator/map';

@Injectable()
export class GuardService implements CanActivate {

  constructor(private _tokenService: TokenService, private _router: Router) { }

  canActivate() {
    console.log('AuthGuard#canActivate called');
    if (this._tokenService.get() === null) {
      this._router.navigate(['/']);
    }
    return true;
  }

}
