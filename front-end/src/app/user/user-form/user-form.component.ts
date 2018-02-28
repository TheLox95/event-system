import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  user = {username: '', password: ''};
  token = '';
  authenticationFlag = true;

  constructor(private _userService: UserService, private _router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this._userService.postUser(this.user.username, this.user.password).subscribe(res => {
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

}
