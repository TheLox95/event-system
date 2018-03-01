import { Invitation } from './../invitation';
import {Params, ActivatedRoute} from '@angular/router';
import { EventService } from './../event.service';
import { UserService } from './../../user/user.service';
import {CategoryService} from '../category.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EventInterface } from '../EventInterface';
import { Address } from 'angular-google-place';
import { Observable } from 'rxjs/Observable';
import User from '../../user/User';

@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.component.html'
})
export class EventEditorComponent implements OnInit {
  event = {} as EventInterface;

  public categories$: Observable<{'id', 'title', 'description', 'image'}[]>;
  @ViewChild('gmap') public gmapElement: any;
  @ViewChild('gmapInput') public gmapInputElement: any;
  private mapProp = {
    center: new google.maps.LatLng(18.5793, 73.8143),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  private _currentUser: User;
  private _eventId: string;
  private _googleMap: google.maps.Map;
  errorRes = '';


  constructor(
    private _categoryService: CategoryService,
    private _userService: UserService,
    private _eventService: EventService,
    private _activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.categories$ = this._categoryService.get();
    this._googleMap = new google.maps.Map(this.gmapElement.nativeElement, this.mapProp);
    this._userService.getCurrent().subscribe(this._getEvent);
    this._activeRoute.queryParamMap
      .map((params: Params) => params.params)
      .subscribe(params => {
        if (params) {
          this._eventId = params['event'];
          console.log(this._eventId);
        }
      });
  }

  private readonly _getEvent = (user) => {
    this._eventService.get(user).subscribe(server_res => {
      if (server_res['error'] === true) {
        this.errorRes = server_res['error'];
        return;
      }
      const eventRes = server_res['body'].filter((item) => {
        return item._id === this._eventId ? event : null;
      });
      this.event = eventRes[0];
      const latAndLgn = new google.maps.LatLng(this.event.location.latitude, this.event.location.longitude);
      this._googleMap.setCenter(latAndLgn);

      const placeService = new google.maps.places.PlacesService(this._googleMap);
      placeService.getDetails(
        {placeId: this.event.location.place_id},
        res => {
          this.gmapInputElement.nativeElement.value = res.name;
          const marker = new google.maps.Marker({
            position: latAndLgn,
            title: res.name
        });
        marker.setMap(this._googleMap);
      });

    });
  }

  onSubmit() {
    console.log('event-editor submit');
  }

  getAddress(place: Address) {
    console.log('Address', place);
  }

  getFormattedAddress(event: any) {
    console.log(event);
  }

  invitateUser(username: string) {
    this.errorRes = '';
    this._userService.getByUsername(username).subscribe(res => {
      if (res['error'] === true) {
        return this._setErrorMessage(res['body']);
      }
      const invitation = new Invitation(res['body'], this.event, false);
      this._eventService.invitate(invitation).subscribe(resInvitation => {
        if (resInvitation['error'] === true) {
          return this._setErrorMessage(resInvitation['body']);
        }
      });
    }, console.log);
  }

  private _setErrorMessage(error) {
    this.errorRes = error.toString();
    return;
  }

}
