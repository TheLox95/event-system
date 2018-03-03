import {Router} from '@angular/router';
import { UserService } from './../../user/user.service';
import { EventService } from './../event.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../category.service';
import { Observable } from 'rxjs/Observable';
import { EventInterface } from '../EventInterface';
import User from '../../user/User';
import { Address } from 'angular-google-place';
import LocationInterface from '../LocationInterface';

@Component({
  selector: 'app-event-register',
  templateUrl: './event-register.component.html'
})
export class EventRegisterComponent implements OnInit {
  public responseError = '';
  public categories: Observable<{'id', 'title', 'description', 'image'}[]>;
  private _currentUser: User;
  private currentLocation: LocationInterface = {longitude: 0, latitude: 0, place_id: ''};
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
    'location': undefined,
    'count': 0,
    'aproved': false
  } as EventInterface;

  constructor(
    private _categoryService: CategoryService,
    private _eventService: EventService,
    private _userService: UserService,
    private _router: Router) { }

    getAddress(place: Address) {
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
