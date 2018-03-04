import { EventEditComponent } from './event/event-edit/event-edit.component';
import { CategoryService } from './event/category.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PanelComponent } from './dashboard/panel/panel.component';
import { UserService } from './user/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TokenService } from './auth/token.service';
import { GuardService } from './auth/guard.service';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { GoogleMapComponent } from './google-map/google-map.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EventService } from './event/event.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './event/register/register.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TokenInterceptor } from './token-interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

const appRoutes: Routes = [
  { path: '', component: UserLoginComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'panel', component: DashboardComponent, canActivate: [GuardService], children: [
    {path: '', component: PanelComponent },
    { path: 'newEvent', component: RegisterComponent },
    { path: 'eventDetail', component: EventDetailComponent },
    { path: 'eventEdit', component: EventEditComponent }
  ] }
];


@NgModule({
  declarations: [
    AppComponent,
    CapitalizePipe,
    GoogleMapComponent,
    UserLoginComponent,
    UserRegisterComponent,
    PanelComponent,
    DashboardComponent,
    RegisterComponent,
    EventEditComponent,
    EventDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAGE_kW-1BQCRZtfgeou-D8-7U1qdUrVTE',
      libraries: ['places']
    }),
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [TokenService, GuardService, UserService, CategoryService, EventService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
