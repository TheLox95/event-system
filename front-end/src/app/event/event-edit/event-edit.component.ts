import {EventInterface} from '../EventInterface';
import { EventService } from './../event.service';
import { Component, OnInit } from '@angular/core';
import { Address } from 'angular-google-place';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html'
})
export class EventEditComponent implements OnInit {
  event = {} as EventInterface;

  constructor(private _eventService: EventService) { }

  ngOnInit() {
  }

  getAddress(place: Address) {
    console.log('Address', place);
  }

  getFormattedAddress(event: any) {
    console.log(event);
  }

}
