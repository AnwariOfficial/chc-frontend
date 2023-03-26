import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../model/user';

import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { CustomHttpRespone } from '../model/custom-http-response';

import { Router } from '@angular/router';
import { FileUploadStatus } from '../model/file-upload.status';
import { Role } from '../enum/role.enum';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from '../services/user-profile.service';
import { UserProfile } from '../model/user-profile';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  public user: User;
  public fileName: string;
  public profileImage: File;
  private subscriptions: Subscription[] = [];
  public fileStatus = new FileUploadStatus();
  public userProfile:UserProfile;
  public editUserProfile = new UserProfile();

  public availableProfile: UserProfile;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,  private toastr: ToastrService,private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.userProfileService.getUserProfileOfCurrentUser(this.user.id).subscribe(
      (response: UserProfile) => {
                
                this.userProfile = response;
              },
              (errorResponse: HttpErrorResponse) => {
               
                this.toastr.error(errorResponse.error.message)
                
              }
            );
  }

  public onProfileImageChange(e : Event): void {

    this.fileName =  (<HTMLInputElement>e.target).files[0].name;
    this.profileImage = (<HTMLInputElement>e.target).files[0];
  }

  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage);
    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<User>) => {
        },
        (errorResponse: HttpErrorResponse) => {
         this.toastr.error('Notification', errorResponse.error.message);
          this.fileStatus.status = 'done';
        }
      )
    );
  }

  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          //this.sendNotification(NotificationType.SUCCESS, `${event.body.firstName}\'s profile image updated successfully`);
          this.toastr.success('Notification', `${event.body.firstName}\'s profile image updated successfully, Please Fresh the Page`);
         
          this.fileStatus.status = 'done';
          break;
        } else {
          //this.sendNotification(NotificationType.ERROR, `Unable to upload image. Please try again`);
          this.toastr.error('Notification', `Unable to upload image. Please try again`);
          break;
        }
      default:
        `Finished all processes`;
    }
  }

  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
  }

  public onResetPassword(emailForm: NgForm): void {
    
    const emailAddress = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpRespone) => {
          this.toastr.success('Notification', response.message);
          
        },
        (error: HttpErrorResponse) => {
          this.toastr.warning('Notification', error.error.message);
          
        },
        () => emailForm.reset()
      )
    );
  }
  openPhotoWindo(id :string){
    this.clickButton(id);

  }
  public onUserProfile(): void {
    const formData = this.userProfileService.createUserProfileFormDate(this.userProfile, this.user.id.toString());
    this.subscriptions.push(
      this.userProfileService.getUserProfileOfCurrentUser(this.user.id).subscribe(
        (res:UserProfile)=>{
          this.availableProfile = res;

        },(error:HttpErrorResponse)=>{
          this.availableProfile = null;
        }
      )
    );
    if(this.availableProfile == null){
      this.subscriptions.push(
        this.userProfileService.updateUserProfile(formData).subscribe(
          (response: UserProfile) => {
      
            this.toastr.success(`Profile updated successfully`)
          },
          (errorResponse: HttpErrorResponse) => {
           
            this.toastr.error(errorResponse.error.message)
            this.profileImage = null;
          }
        )
        );
    }
    else{
      this.subscriptions.push(
        this.userProfileService.addUserProfile(formData).subscribe(
          (response: UserProfile) => {
      
            this.toastr.success(`Profile Added successfully`)
          },
          (errorResponse: HttpErrorResponse) => {
           
            this.toastr.error(errorResponse.error.message)
            this.profileImage = null;
          }
        )
        );

    }
    
  }
  
  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
