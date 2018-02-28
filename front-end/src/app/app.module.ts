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

const appRoutes: Routes = [
  { path: '', component: UserLoginComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'panel', component: DashboardComponent, canActivate: [GuardService] },
  { path: 'newEvent', component: EventFormComponent, canActivate: [GuardService] }
];


@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    DashboardComponent,
    EventFormComponent,
    UserRegisterComponent,
    EventRegisterComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [UserService, GuardService, TokenService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
