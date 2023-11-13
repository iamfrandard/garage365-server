import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AppointmentClientListComponent } from './appointment-client/appointment-client-list/appointment-client-list.component';
import { AppointmentClientDetailsComponent } from './appointment-client/appointment-client-details/appointment-client-details.component';

import { ManagementEmployeeComponent } from './management-employee/management-employee.component';
import { ManagementScheduleComponent } from './management-schedule/management-schedule.component';
import { ManagementServiceComponent } from './management-service/management-service.component';

import { VerifyAccountUComponent } from './verify-accountU/verify-accountU.component';
import { VerifyAccountEComponent } from './verify-accountE/verify-accountE.component';

import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeComponent },
  { path: 'ingreso', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'recoverpassword', component: RecoverPasswordComponent },
  { path: 'resetpassword/:id', component: ResetPasswordComponent },
  { path: 'perfil', component: ProfileComponent },
  { path: 'busqueda', component: SearchComponent },
  { path: 'tutorials', component: AppointmentClientListComponent },
  { path: 'appointment/:id', component: AppointmentClientDetailsComponent },
  { path: 'employee', component: ManagementEmployeeComponent },
  { path: 'schedule', component: ManagementScheduleComponent },
  { path: 'service', component: ManagementServiceComponent },
  { path: 'verifyAccountU/:id', component: VerifyAccountUComponent },
  { path: 'verifyAccountE/:id', component: VerifyAccountEComponent },
  { path: 'configuracion', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
