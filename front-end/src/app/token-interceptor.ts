import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TokenService } from './auth/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: TokenService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.get()}`
      }
    });
    return next.handle(request);
  }
}
