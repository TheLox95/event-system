import { EventService } from './event/event.service';
import { TokenService } from './auth/token.service';
import {Routes, RouterModule} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { FormsModule } from '@angular/forms';
import { UserService } from './user/user.service';
import { GuardService } from './auth/guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TokenInterceptor } from './token-interceptor';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { EventRegisterComponent } from './event/event-register/event-register.component';
import { CategoryService } from './event/category.service';
import {AngularGooglePlaceModule} from 'angular-google-place';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { PanelComponent } from './dashboard/panel/panel.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { EventEditComponent } from './event/event-edit/event-edit.component';

const appRoutes: Routes = [
  { path: '', component: UserLoginComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'panel', component: DashboardComponent, canActivate: [GuardService], children: [
    {path: '', component: PanelComponent },
    { path: 'newEvent', component: EventRegisterComponent },
    { path: 'eventDetail', component: EventDetailComponent },
    { path: 'eventEdit', component: EventEditComponent }
  ] }
];


@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    DashboardComponent,
    UserRegisterComponent,
    EventRegisterComponent,
    EventDetailComponent,
    PanelComponent,
    CapitalizePipe,
    EventEditComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AngularGooglePlaceModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [UserService, GuardService, TokenService, CategoryService, EventService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
