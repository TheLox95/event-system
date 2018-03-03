import { Invitation, IsGoingState } from '../invitation';
import { Params, ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { UserService } from '../../user/user.service';
import { CategoryService } from '../category.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventInterface } from '../EventInterface';
import { Address } from 'angular-google-place';
import { Observable } from 'rxjs/Observable';
import User from '../../user/User';
import Category from '../CategoryInterface';
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html'
})
export class EventDetailComponent implements OnInit {
  event = {} as EventInterface;

  public categories: Category[];
  @ViewChild('gmap') public gmapElement: any;
  @ViewChild('gmapInput') public gmapInputElement: any;
  @ViewChild('eventImage') eventImage: ElementRef;
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
    private _activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._categoryService.get().subscribe(cats => this.categories = cats);
    this._activeRoute.queryParamMap
      .map((params: Params) => params.params)
      .subscribe(params => {
        this._eventId = params['event'];
        this._userService.getCurrent().subscribe(this._onUser);
      });
  }

  private readonly _onUser = user => {
    this._eventService.get(user).subscribe(server_res => {
      if (server_res['error'] === true) {
        this.errorRes = server_res['body'];
        return;
      }

      this.event = server_res['body'].filter(this._filterCurrentEvent)[0];
      console.log(this.event);
      this.event.category = this.categories.filter(cat => cat.id === this.event.category_id ? true : false )[0];
      this.getImage();
      this._loadGoogleMap();
    });
  }

  getAddress(place: Address) {
    console.log('Address', place);
  }

  getFormattedAddress(event: any) {
    console.log(event);
  }

  getImage() {
    this._eventService.image(this.event.event_name).subscribe(image => {
      this.eventImage.nativeElement.src = image;
    });
  }

  invitateUser(username: string) {
    this.errorRes = '';
    this._userService.getByUsername(username).subscribe(res => {
      if (res['error'] === true) {
        return this._setErrorMessage(res['body']);
      }
      const invitation = new Invitation(res['body'], this.event, IsGoingState.UNRESPONDED) ;
      this._eventService.invitate(invitation).subscribe(resInvitation => {
        if (resInvitation['error'] === true) {
          return this._setErrorMessage(resInvitation['body']);
        }
        this.event.invitations.push(invitation);
      });
    }, console.log);
  }

  private _setErrorMessage(error) {
    this.errorRes = error.toString();
    return;
  }

  private readonly _filterCurrentEvent = item => {
    return item._id === this._eventId ? event : null;
  }

  private _loadGoogleMap() {
    this._googleMap = new google.maps.Map(this.gmapElement.nativeElement, this.mapProp);
    const latAndLgn = new google.maps.LatLng(this.event.location.latitude, this.event.location.longitude);

    this._googleMap.setCenter(latAndLgn);

    const placeService = new google.maps.places.PlacesService(this._googleMap);
    placeService.getDetails({ placeId: this.event.location.place_id }, res => {
      this.gmapInputElement.nativeElement.value = res.name;
      const marker = new google.maps.Marker({position: latAndLgn, title: res.name});
      marker.setMap(this._googleMap);
    });
  }
}
