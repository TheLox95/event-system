import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import User from '../User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html'
})
export class UserRegisterComponent implements OnInit {
  user = new User();

  constructor(private _userService: UserService, private _route: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('asd');
    this._userService.register(this.user).subscribe(this.redirect);
  }

  goToLogin() {
    this._route.navigate(['/']);
  }

  private readonly redirect = (res) => {
    if (res['success'] === true) {
      this._route.navigate(['/'], {queryParams: {'msg': 'User register successfully'}});
    }
  }

}
