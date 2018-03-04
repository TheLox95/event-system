import {Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CategoryService } from '../category.service';
import User from '../../user/User';
import LocationInterface from '../LocationInterface';
import { UserService } from './../../user/user.service';
import { EventService } from './../event.service';
import { EventInterface } from '../EventInterface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  public responseError = '';
  public categories: Observable<{'id', 'title', 'description', 'image'}[]>;
  private _currentUser: User;
  private currentLocation: LocationInterface = {longitude: 0, latitude: 0, place_id: ''};
  dates: Date[] = [];
  event = {
    'category_id': '',
    'event_name': '',
    'user_id': '',
    'description': '',
    'image': '',
    'start_timestamp': '',
    'modified': '',
    'end_timestamp': '',
    'location': undefined,
    'count': 0,
    'aproved': false
  } as EventInterface;

  constructor(
    private _categoryService: CategoryService,
    private _eventService: EventService,
    private _userService: UserService,
    private _router: Router) { }

    getAddress(place) {
      this.currentLocation.place_id = place.place_id;
    }

    getFormattedAddress(event: any) {
      console.log(event);
      this.currentLocation.latitude = event.lat;
      this.currentLocation.longitude = event.lng;
      this.event.location = this.currentLocation;
    }

  ngOnInit() {
    this.categories = this._categoryService.get();
    this._userService.getCurrent().subscribe(user => this._currentUser = user);
  }

  onSubmit() {
    console.log('submit event');
    this.event.user_id = this._currentUser._id;
    this.event.start_timestamp = this.dates[0].toISOString();
    this.event.end_timestamp = this.dates[1].toISOString();
    this._eventService.post(this.event).subscribe(this.handleResponse, console.log, console.log);
  }

  handleFileInput(files: FileList) {
    this.event.image = files.item(0);
  }

  private readonly handleResponse = (res) => {
    if (res.error === true) {
      this.responseError = res.body;
      return;
    }
    this._router.navigate(['/panel'], {queryParams: {msg: res.body}});
  }

}
