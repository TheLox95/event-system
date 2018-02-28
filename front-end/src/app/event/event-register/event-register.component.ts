import {Router} from '@angular/router';
import { UserService } from './../../user/user.service';
import { EventService } from './../event.service';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Observable } from 'rxjs/Observable';
import { EventInterface } from '../EventInterface';
import User from '../../user/User';

@Component({
  selector: 'app-event-register',
  templateUrl: './event-register.component.html',
  styleUrls: ['./event-register.component.css']
})
export class EventRegisterComponent implements OnInit {
  event = {
    'category_id': '',
    'event_name': '',
    'user_id': '',
    'description': '',
    'image': '',
    'start_date': '',
    'end_date': '',
    'modified': '',
    'start_time': '',
    'end_time': '',
    'location': '',
    'count': 0,
    'aproved': true,
  } as EventInterface;

  responseError = '';

  categories: Observable<{'id', 'title', 'description', 'image'}[]>;
  private _currentUser: User;

  constructor(
    private _categoryService: CategoryService,
    private _eventService: EventService,
    private _userService: UserService,
    private _router: Router) { }

  ngOnInit() {
    this.categories = this._categoryService.get();
    this._userService.getCurrent().subscribe(user => this._currentUser = user);
  }

  onSubmit() {
    console.log('submit event');
    this.event.user_id = this._currentUser._id;
    this._eventService.post(this.event).subscribe(this.handleResponse, console.log, console.log);
  }

  private readonly handleResponse = (res) => {
    if (res.error === true) {
      this.responseError = res.body;
    }
    this._router.navigate(['/panel'], {queryParams: {msg: res.body}});
  }

}
