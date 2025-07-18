import { RouterModule, Routes } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { HrDashboardComponent } from './hr/hr-dashboard/hr-dashboard.component';
import { LoginComponent } from './login/login.component';
import { ManagerDashboardComponent } from './manager/manager-dashboard/manager-dashboard.component';
import { TeamDashboardComponent } from './team/team-dashboard/team-dashboard.component';
import { authGuard } from './auth.guard';
import { ProfileComponent } from './part/profile/profile.component';
import { NotificationComponent } from './part/notification/notification.component';
import { OfferletterComponent } from './part/offerletter/offerletter.component';
import { AppointmentletterComponent } from './part/appointmentletter/appointmentletter.component';
import { ChangepasswordComponent } from './part/changepassword/changepassword.component';
import { IncrementletterComponent } from './part/incrementletter/incrementletter.component';
import { DayliteamworkComponent } from './part/dayliteamwork/dayliteamwork.component';
import { TaskReportComponent } from './all_report/task-report/task-report.component';
import { DashboardComponent } from './part/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',


  },
  {
    path: 'login',
    component: LoginComponent
  },


  {
    path: 'hr-dashboard',
    canActivate: [authGuard],
    component: HrDashboardComponent,
    data: { role: 'HR' },
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'offerletter', component: OfferletterComponent },
      { path: 'appointmentletter', component: AppointmentletterComponent },
      { path: 'changepassword', component: ChangepasswordComponent },
      { path: 'incrementletter', component: IncrementletterComponent },
      { path: 'dayliteamwork', component: DayliteamworkComponent },
      { path: 'task_report', component: TaskReportComponent },
      { path: 'dashboard', component: DashboardComponent }


    ]

  },
  {
    path: 'manager-dashboard',
    canActivate: [authGuard],
    component: ManagerDashboardComponent,
    data: { role: 'Manager' },
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'dayliteamwork', component: DayliteamworkComponent },
      { path: 'task_report', component: TaskReportComponent }
    ]

  },
  {
    path: 'team-dashboard',
    canActivate: [authGuard],
    component: TeamDashboardComponent,
    data: { role: 'Team' },
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'dayliteamwork', component: DayliteamworkComponent },
      { path: 'task_report', component: TaskReportComponent },
      { path: 'dashboard', component: DashboardComponent }
    ]
  },






];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }