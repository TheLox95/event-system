import { Component, OnInit, ViewChild, EventEmitter, Output, ElementRef, NgZone } from '@angular/core';
import {} from '@types/googlemaps';
import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styles: ['agm-map {height: 300px;}']
})
export class GoogleMapComponent implements OnInit {

  @ViewChild('search')
  public searchElementRef: ElementRef;
  @Output() addressFormat = new EventEmitter<any>();
  @Output() address = new EventEmitter<any>();
  latitude = -74.005973;
  longitude = 40.712775;
  zoom: number;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit() {
    this.zoom = 4;

    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.address.emit({place_id: place.id});
          this.addressFormat.emit(place.geometry.location.toJSON());

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 15;
        });
      });
    });
  }

  setCenter(latLng: google.maps.LatLngLiteral, place_id: string) {
    this.latitude = latLng.lat;
    this.longitude = latLng.lng;
    this.zoom = 15;
  }

}
