import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Address } from 'angular-google-place';
import { setTimeout } from 'timers';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html'
})
export class GoogleMapComponent implements OnInit {

  @ViewChild('gmap') public gmapElement: any;
  @ViewChild('mapInput') public mapInputElement: any;
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
    this._map.setCenter(new google.maps.LatLng(event.lat, event.lng));
    this.addressFormat.emit(event);
  }

  async setCenter(latLng: google.maps.LatLng | google.maps.LatLngLiteral, place_id: string) {
    await this._waitForMapToLoad();
    await this._map.setCenter(latLng);

    const place = await this._getPlace(place_id);
    this.mapInputElement.nativeElement.value = place.name;
    this._addMarker(latLng, place.name);
  }

  private _getPlace(place_id) {
    return new Promise<google.maps.places.PlaceResult>((resolve, rejected) => {
      const placeService = new google.maps.places.PlacesService(this._map);
      placeService.getDetails({ placeId: place_id }, res => {
        resolve(res);
      });
    });
  }

  private _addMarker(latLng: google.maps.LatLng | google.maps.LatLngLiteral, title: string) {
    const marker = new google.maps.Marker({position: latLng, title});
    marker.setMap(this._map);
  }

  private _waitForMapToLoad() {
    let wait = Promise.resolve();
    if (this._map === undefined) {
      wait = new Promise((resolve, rejected) => {
        setTimeout(() => {
          if (this._map !== undefined) {
            resolve();
          }
        }, 500);
      });
    }
    return wait;
  }

}
