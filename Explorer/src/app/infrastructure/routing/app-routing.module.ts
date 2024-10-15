import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ClubsComponent } from 'src/app/feature-modules/tour-authoring/clubs/clubs.component';
import { Object } from 'src/app/feature-modules/tour-authoring/model/object.model';
import { ObjectComponent } from 'src/app/feature-modules/tour-authoring/object/object.component';
import { ObjectFormComponent } from 'src/app/feature-modules/tour-authoring/object-form/object-form.component';
import { TourPreferencesComponent } from 'src/app/feature-modules/tour-execution/tour-preferences/tour-preferences.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { TourFormComponent } from 'src/app/feature-modules/tour-authoring/tour-form/tour-form.component'; 
import { TourEquipmentComponent } from 'src/app/feature-modules/tour-authoring/tour-equipment/tour-equipment.component';
import { KeyPointComponent } from 'src/app/feature-modules/tour-authoring/key-point/key-point/key-point.component';
import { KeyPointFormComponent } from 'src/app/feature-modules/tour-authoring/key-point-form/key-point-form.component';

const routes: Routes = [

  
  {path: 'key-points/:tourId', component: KeyPointComponent, canActivate: [AuthGuard]},
  {path: 'key-points-form/:tourId', component: KeyPointFormComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'clubs', component: ClubsComponent},
  {path: 'object', component: ObjectComponent},
  {path: 'objectForm', component: ObjectFormComponent},
  {path: 'tours', component: TourComponent, canActivate: [AuthGuard] },
  {path: 'add-tour', component: TourFormComponent, canActivate: [AuthGuard] }, 
  { path: 'tour-equipment', component: TourEquipmentComponent, canActivate: [AuthGuard] },
  {path: 'tour-preferences', component: TourPreferencesComponent, canActivate: [AuthGuard],},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
