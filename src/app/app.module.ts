import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';

import { AppointmentClientListComponent } from './appointment-client/appointment-client-list/appointment-client-list.component';
import { AppointmentClientDetailsComponent } from './appointment-client/appointment-client-details/appointment-client-details.component';

import { AppointmentWorkshopListComponent } from './appointment-workshop/appointment-workshop-list/appointment-workshop-list.component';

import { httpInterceptorProviders } from './helpers/http.interceptor';

import { HeaderComponent } from './hearder/header.component';
import { FooterComponent } from './footer/footer.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { ManagementEmployeeComponent } from './management-employee/management-employee.component';
import { ManagementScheduleComponent } from './management-schedule/management-schedule.component';
import { ManagementServiceComponent } from './management-service/management-service.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

import { VerifyAccountUComponent } from './verify-accountU/verify-accountU.component';
import { VerifyAccountEComponent } from './verify-accountE/verify-accountE.component';

import { SettingsComponent } from './settings/settings.component';
import { SettingsUserComponent } from './settings-user/settings-user.component';
import { SettingsWorkshopComponent } from './settings-workshop/settings-workshop.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    SearchComponent,
    AppointmentClientListComponent,
    AppointmentClientDetailsComponent,
    AppointmentWorkshopListComponent,
    HeaderComponent,
    FooterComponent,
    RecoverPasswordComponent,
    ResetPasswordComponent,
    ManagementEmployeeComponent,
    ManagementScheduleComponent,
    ManagementServiceComponent,
    VerifyAccountUComponent,
    VerifyAccountEComponent,
    SettingsComponent,
    SettingsUserComponent,
    SettingsWorkshopComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
