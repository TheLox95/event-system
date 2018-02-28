import { EventService } from './../event.service';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Observable } from 'rxjs/Observable';
import { EventInterface } from '../EventInterface';

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

  categories: Observable<{'id', 'title', 'description', 'image'}[]>;

  constructor(private _categoryService: CategoryService, private _eventService: EventService) { }

  ngOnInit() {
    this.categories = this._categoryService.get();
  }

  onSubmit() {
    console.log('submit event');
    this._eventService.post(this.event).subscribe(console.log, console.log, console.log);
  }

}
