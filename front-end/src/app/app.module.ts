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
import { EventFormComponent } from './dashboard/event-form/event-form.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { EventRegisterComponent } from './event/event-register/event-register.component';
import { CategoryService } from './event/category.service';
import {AngularGooglePlaceModule} from 'angular-google-place';
import { EventEditorComponent } from './event/event-editor/event-editor.component';

const appRoutes: Routes = [
  { path: '', component: UserLoginComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'panel', component: DashboardComponent, canActivate: [GuardService] },
  { path: 'newEvent', component: EventRegisterComponent, canActivate: [GuardService] },
  { path: 'eventEditor', component: EventEditorComponent, canActivate: [GuardService] }
];


@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    DashboardComponent,
    EventFormComponent,
    UserRegisterComponent,
    EventRegisterComponent,
    EventEditorComponent
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
