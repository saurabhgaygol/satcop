import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HrDashboardComponent } from './hr/hr-dashboard/hr-dashboard.component';
import { LoginComponent } from './login/login.component';
import { ManagerDashboardComponent } from './manager/manager-dashboard/manager-dashboard.component';
import { TeamDashboardComponent } from './team/team-dashboard/team-dashboard.component';

export const routes: Routes = [
{ 
  path: '', 
  redirectTo: 'login', 
  pathMatch: 'full' 
},  
{
  path: 'login', 
  component: LoginComponent
},
{
  path: 'hr-dashboard',
  component: HrDashboardComponent
},
{
  path: 'manager-dashboard',
  component: ManagerDashboardComponent
},
{
  path: 'team-dashboard',
  component: TeamDashboardComponent
}
  
  

];
 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}