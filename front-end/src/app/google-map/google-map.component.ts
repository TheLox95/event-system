import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Address } from 'angular-google-place';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html'
})
export class GoogleMapComponent implements OnInit {

  @ViewChild('gmap') public gmapElement: any;
  @Output() addressFormat = new EventEmitter<any>();
  @Output() address = new EventEmitter<Address>();
  private _map: google.maps.Map;
  private mapProp = {
    center: new google.maps.LatLng(18.5793, 73.8143),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  constructor() { }

  ngOnInit() {
    this._map = new google.maps.Map(this.gmapElement.nativeElement, this.mapProp);
  }

  getAddress(place: Address) {
    this.address.emit(place);
  }

  getFormattedAddress(event: any) {
    console.log(event);
    this._map.setCenter(new google.maps.LatLng(event.lat, event.lng));
    this.addressFormat.emit(event);
  }

}
