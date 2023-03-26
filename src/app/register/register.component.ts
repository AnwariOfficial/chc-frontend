import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { User } from '../model/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  private subscriptions: Subscription[] = [];
  constructor(private router: Router, private authenticationService: AuthenticationService, private toastr: ToastrService ) {}

ngOnInit(): void {
if (this.authenticationService.isUserLoggedIn()) {
this.router.navigateByUrl('/user/management');
}
}

public onRegister(user: User): void {
//this.showLoading = true;
this.subscriptions.push(
this.authenticationService.register(user).subscribe(
(response: User) => {
this.toastr.success(`A new account was created for ${response.firstName}.Please check your email for password to log in.`);
},
(errorResponse: HttpErrorResponse) => {
//this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
this.toastr.error(errorResponse.error.message);
//this.showLoading = false;
}
)
);
}
}
