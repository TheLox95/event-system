import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  user = {username: '', password: ''};
  token = '';

  constructor(private _userService: UserService) { }

  ngOnInit() {
  }

  onSubmit() {
    this._userService.postUser(this.user.username, this.user.password).subscribe(res => {
      this.token = res['token'];
    });
  }

  getUser() {
    this._userService.getCurrent(this.token).subscribe(console.log);
  }

}
