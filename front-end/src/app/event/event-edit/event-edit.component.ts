import { GoogleMapComponent } from './../../google-map/google-map.component';
import {EventInterface} from '../EventInterface';
import { EventService } from './../event.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Address } from 'angular-google-place';
import { ActivatedRoute, Params } from '@angular/router';
import LocationInterface from '../LocationInterface';
import { CategoryService } from '../category.service';
import Category from '../CategoryInterface';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html'
})
export class EventEditComponent implements OnInit {
  event = {} as EventInterface;
  categories: Category[];
  private currentLocation: LocationInterface = {longitude: 0, latitude: 0, place_id: ''};
  @ViewChild(GoogleMapComponent) googleMapComponent: GoogleMapComponent;
  @ViewChild('eventImage') eventImage: ElementRef;


  constructor(private _eventService: EventService,  private _activeRoute: ActivatedRoute, private _categoryService: CategoryService) { }

  ngOnInit() {
    this._categoryService.get().subscribe(cats => this.categories = cats);

    this._activeRoute.queryParamMap
    .map((params: Params) => params.params)
    .subscribe(params => {
      if (params) {
        this.event._id = params['id'];
      }
      this._eventService.getById(this.event._id.toString()).subscribe(res => {
        this.event = res.body;
        this.googleMapComponent.setCenter({
          lat: this.event.location.latitude,
          lng: this.event.location.longitude
        }, this.event.location.place_id);

        this.getImage();
        this.event.category = this.categories.filter(cat => cat.id === this.event.category_id ? true : false )[0];
      });
    });
  }

  getAddress(place: Address) {
    console.log('Address', place);
  }

  getFormattedAddress(event: any) {
    console.log(event);
    this.currentLocation.latitude = event.lat;
    this.currentLocation.longitude = event.lng;
    this.event.location = this.currentLocation;
  }

  handleFileInput(files: FileList) {
    this.event.image = files.item(0);
  }

  getImage() {
    this._eventService.image(this.event.event_name).subscribe(image => {
      this.eventImage.nativeElement.src = image;
    });
  }

}
