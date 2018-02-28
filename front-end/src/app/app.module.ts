import { TokenService } from './auth/token.service';
import {Routes, RouterModule} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserFormComponent } from './user/user-form/user-form.component';
import { FormsModule } from '@angular/forms';
import { UserService } from './user/user.service';
import { GuardService } from './auth/guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TokenInterceptor } from './token-interceptor';

const appRoutes: Routes = [
  { path: '', component: UserFormComponent },
  { path: 'panel', component: DashboardComponent, canActivate: [GuardService] }
];


@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,
    DashboardComponent
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
