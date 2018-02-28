import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class CategoryService {

  constructor() { }

  get() {
    return Observable.of([
        {
          'id': '5a9705383395asd35a7e4e',
          'title': 'Event 1',
          'description': 'First Category',
          'image': 'http://lorempixel.com/50/50'
        },
        {
          'id': '5a9aasd3395aa0fd35a7e4e',
          'title': 'Event 2',
          'description': 'Second Category',
          'image': 'http://lorempixel.com/50/50'
        },
        {
          'id': '5a23r3395aa0fd35a7e4e',
          'title': 'Event 3',
          'description': 'Third Category',
          'image': 'http://lorempixel.com/50/50'
        },
        {
          'id': '5r22r383395aa0fd35a7e4e',
          'title': 'Event 4',
          'description': 'Fourth Category',
          'image': 'http://lorempixel.com/50/50'
        }
      ]
    );
  }

}
