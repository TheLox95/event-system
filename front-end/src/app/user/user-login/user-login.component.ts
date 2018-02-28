import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-login.component.html'
})
export class UserLoginComponent implements OnInit {

  user = {username: '', password: ''};
  token = '';
  authenticationFlag = true;
  msg: {[key: string]: any};

  constructor(private _userService: UserService, private _router: Router, private _activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this._activeRoute.queryParamMap
      .map((params: Params) => params.params)
      .subscribe( (params) => {
            if (params) {
              this.msg = params;
            }
        });
  }

  onSubmit() {
    this._userService.login(this.user.username, this.user.password).subscribe(res => {
      if (res['error']) {
        this.authenticationFlag = false;
        return;
      }

      sessionStorage.setItem('token', res['token']);
      this._router.navigate(['/panel']);
    });
  }

  getUser() {
    this._userService.getCurrent().subscribe(console.log);
  }

  goToRegister() {
    this._router.navigate(['/register']);
  }

}
