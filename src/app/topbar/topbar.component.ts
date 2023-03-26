import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../model/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  public user: User;

  constructor(private authenticationService: AuthenticationService,  private toastr: ToastrService,private router: Router ) {}
 
  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
  }
  toggle(){
    const element = document.body as HTMLBodyElement
    element.classList.toggle("toggle-sidebar")
  }
  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
  
    this.toastr.success(`You've been successfully logged out`)
  }
}
