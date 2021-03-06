import { Invitation, IsGoingState } from '../invitation';
import { Params, ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { UserService } from '../../user/user.service';
import { CategoryService } from '../category.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventInterface } from '../EventInterface';
import { Observable } from 'rxjs/Observable';
import User from '../../user/User';
import Category from '../CategoryInterface';
import { GoogleMapComponent } from '../../google-map/google-map.component';
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html'
})
export class EventDetailComponent implements OnInit {
  event = {} as EventInterface;
  user: User;

  public categories: Category[];
  @ViewChild('eventImage') eventImage: ElementRef;
  @ViewChild(GoogleMapComponent) googleMapComponent: GoogleMapComponent;

  private _currentUser: User;
  private _eventId: string;
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
    this.user = user;
    this._eventService.getById(this._eventId).subscribe(server_res => {
      if (server_res['error'] === true) {
        this.errorRes = server_res['body'];
        return;
      }

      this.event = server_res['body'];
      this.googleMapComponent.setCenter({
        lat: this.event.location.latitude,
        lng: this.event.location.longitude
      }, this.event.location.place_id);
      console.log(this.event);
      this.event.category = this.categories.filter(cat => cat.id === this.event.category_id ? true : false )[0];
      this.getImage();
    });
  }

  getImage() {
    this._eventService.image(this.event._id.toString()).subscribe(image => {
      this.eventImage.nativeElement.src = image;
    });
  }

  invitateUser(username: string) {
    this.errorRes = '';
    this._userService.getByUsername(username).subscribe(res => {
      if (res['error'] === true) {
        return this._setErrorMessage(res['body']);
      }
      const invitation = new Invitation(res['body'], this.event, IsGoingState.UNRESPONDED ) ;
      this._eventService.invitate(invitation).subscribe(resInvitation => {
        if (resInvitation['error'] === true) {
          return this._setErrorMessage(resInvitation['body']);
        }
        invitation._id = resInvitation['body']._id;
        this.event.invitations.push(invitation);
      });
    }, console.log);
  }

  cancelInvitation(index) {
    console.log(this.event.invitations[index]);
    this._eventService.cancelInvitation(this.event.invitations[index]).subscribe(res => {
      if (res['error'] === true) {
        this._setErrorMessage(res['body']);
        return;
      }
      this.event.invitations = this.event.invitations.filter((item, indexItem) => indexItem !== index);
    }, console.log);
  }

  private _setErrorMessage(error) {
    this.errorRes = error.toString();
    return;
  }
}
