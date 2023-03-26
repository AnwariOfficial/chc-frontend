import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ProjectComponent } from './project/project.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { DataTablesModule } from 'angular-datatables';

import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationGuard } from './guard/authentication.guard';
import { UserService } from './services/user.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FooterComponent,
    ProjectComponent,
    ProjectDetailsComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    HomeComponent,
    TopbarComponent,
    SidebarComponent,
    UsersComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgApexchartsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    EditorModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule,
    NgxDocViewerModule
  ],

  providers: [AuthenticationGuard, AuthenticationService, UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
