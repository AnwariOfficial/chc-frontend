import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router,
    private toastr: ToastrService) {}

canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
return this.isUserLoggedIn();
}

private isUserLoggedIn(): boolean {
if (this.authenticationService.isUserLoggedIn()) {
return true;
}
this.router.navigate(['/login']);
this.toastr.error('Error', 'You need to log in to access this page');
return false;
}

  
}
