import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    UserProfileComponent
  ]
})
export class LayoutModule { }
