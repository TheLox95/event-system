import {Routes, RouterModule} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UserFormComponent } from './user/user-form/user-form.component';
import { FormsModule } from '@angular/forms';
import { UserService } from './user/user.service';

const appRoutes: Routes = [
  { path: '', component: UserFormComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
