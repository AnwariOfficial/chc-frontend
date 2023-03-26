import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './guard/authentication.guard';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/project.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersComponent } from './users/users.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

const routes: Routes = [
  {path:'',redirectTo:'dashboard',pathMatch:'full'},
  {path:'dashboard',component:MainComponent, canActivate: [AuthenticationGuard] },
  {path:'users', component:UsersComponent, canActivate: [AuthenticationGuard]},
  {path:'projects', component:ProjectComponent, canActivate: [AuthenticationGuard]},
  {path:'project-details', component:ProjectDetailsComponent, canActivate: [AuthenticationGuard]},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'profile',component:UserProfileComponent, canActivate: [AuthenticationGuard]},
  {path:'home',component:HomeComponent, canActivate: [AuthenticationGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
