import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, map, Observable, of, startWith, Subject, Subscription } from 'rxjs';
import { Role } from '../enum/role.enum';
import { ApiResponse } from '../interface/api-response';
import { Page } from '../interface/page';
import { CustomHttpRespone } from '../model/custom-http-response';
import { FileUploadStatus } from '../model/file-upload.status';
import { User } from '../model/user';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  public users: User[];
  public user: User;
  public refreshing: boolean;
  public selectedUser: User;
  public fileName: string;
  public profileImage: File;
  private subscriptions: Subscription[] = [];
  public editUser = new User();
  private currentUsername: string;
  public fileStatus = new FileUploadStatus();
  SelectedNoOfRecords:number = 10;

  records: number[];

  usersState$: Observable<{ appState: string, appData?: ApiResponse<Page>, error?: HttpErrorResponse }>;
  responseSubject = new BehaviorSubject<ApiResponse<Page>>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
public loadingService: BehaviorSubject<boolean> = new BehaviorSubject(false);



  constructor(private router: Router, private authenticationService: AuthenticationService,
    private userService: UserService, private toastr: ToastrService ) {
    }

    ngOnInit(): void {

      this.user = this.authenticationService.getUserFromLocalCache();
      //this.getUsers(true);
     // this.loadingService.next(true);
     this.records = [10,25,50,100];
     this.SelectedNoOfRecords = 10;
  this.usersState$ = this.userService.users$('',0,this.SelectedNoOfRecords).pipe(
    map((response: ApiResponse<Page>) => {
      this.loadingService.next(false);
      this.responseSubject.next(response);
      this.currentPageSubject.next(response.data.page.number);
      console.log(response);
      return ({ appState: 'APP_LOADED', appData: response });
    }),
    startWith({ appState: 'APP_LOADING' }),
    catchError((error: HttpErrorResponse) =>{ 
      this.loadingService.next(false);
      return of({ appState: 'APP_ERROR', error })}
      )
  )
}

getAllUsers(){
  this.gotToPage('',0,this.SelectedNoOfRecords)
}

gotToPage(name?: string, pageNumber: number = 0, size?: number): void {
  this.loadingService.next(true);
  this.usersState$ = this.userService.users$(name, pageNumber,this.SelectedNoOfRecords).pipe(
    map((response: ApiResponse<Page>) => {
      this.loadingService.next(false);
      this.responseSubject.next(response);
      this.currentPageSubject.next(pageNumber);
      console.log(response);
      console.log("------------->>"+size)
      return ({ appState: 'APP_LOADED', appData: response });
    }),
    startWith({ appState: 'APP_LOADED', appData: this.responseSubject.value }),
    catchError((error: HttpErrorResponse) =>{ 
      this.loadingService.next(false);
      return of({ appState: 'APP_ERROR', error })}
      )
  )
}

goToNextOrPreviousPage(direction?: string, name?: string, no?:number): void {
  this.gotToPage(name, direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1,no);
}
      
    
    // public getUsers(showNotification: boolean): void {
    //   this.refreshing = true;
    //   this.subscriptions.push(
    //     this.userService.getUsers().subscribe(
    //       (response: User[]) => {
    //         this.userService.addUsersToLocalCache(response);
    //         this.users = response;
    //       //  this.dtTrigger.next(null);
    //         this.refreshing = false;
    //         if (showNotification) {
            
    //           this.toastr.success(`${response.length} user(s) loaded successfully.`)
    //         }
    //       },
    //       (errorResponse: HttpErrorResponse) => {
           
    //         this.toastr.error(errorResponse.error.message)
            
    //         this.refreshing = false;
    //       }
    //     )
    //   );
  
    // }
    public onSelectUser(selectedUser: User): void {
      this.selectedUser = selectedUser;
      this.clickButton('openUserInfo');
    }
    public onProfileImageChange(e : Event): void {
      this.fileName =  (<HTMLInputElement>e.target).files[0].name;
      this.profileImage = (<HTMLInputElement>e.target).files[0];
    }  
    public saveNewUser(): void {
      this.clickButton('new-user-save');
    }
    public onAddNewUser(userForm: NgForm): void {
      const formData = this.userService.createUserFormDate(null, userForm.value, this.profileImage);
      this.subscriptions.push(
        this.userService.addUser(formData).subscribe(
          (response: User) => {
            this.clickButton('new-user-close');
            this.gotToPage('',0,this.SelectedNoOfRecords)
            //this.getUsers(false);
            this.fileName = null;
            this.profileImage = null;
            userForm.reset();
           
            this.toastr.success(`${response.firstName} ${response.lastName} added successfully`)
          },
          (errorResponse: HttpErrorResponse) => {
           
           this.toastr.error(errorResponse.error.message)
            this.profileImage = null;
          }
        )
        );
    }
    public onUpdateUser(): void {
      const formData = this.userService.createUserFormDate(this.currentUsername, this.editUser, this.profileImage);
      this.subscriptions.push(
        this.userService.updateUser(formData).subscribe(
          (response: User) => {
            this.clickButton('closeEditUserModalButton');
            this.gotToPage('',0,this.SelectedNoOfRecords)
            //this.getUsers(false);
            this.fileName = null;
            this.profileImage = null;
          
            this.toastr.success(`${response.firstName} ${response.lastName} updated successfully`)
          },
          (errorResponse: HttpErrorResponse) => {
           
            this.toastr.error(errorResponse.error.message)
            this.profileImage = null;
          }
        )
        );
    }
    public onUpdateCurrentUser(user: User): void {
      this.refreshing = true;
      this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
      const formData = this.userService.createUserFormDate(this.currentUsername, user, this.profileImage);
      this.subscriptions.push(
        this.userService.updateUser(formData).subscribe(
          (response: User) => {
            this.authenticationService.addUserToLocalCache(response);
            this.gotToPage('',0,this.SelectedNoOfRecords)
           // this.getUsers(false);
            this.fileName = null;
            this.profileImage = null;
            
            this.toastr.success(`${response.firstName} ${response.lastName} updated successfully`)
          },
          (errorResponse: HttpErrorResponse) => {
           
            this.toastr.error(errorResponse.error.message)
            this.refreshing = false;
            this.profileImage = null;
          }
        )
        );
    }
    public onUpdateProfileImage(): void {
      const formData = new FormData();
      formData.append('username', this.user.username);
      formData.append('profileImage', this.profileImage);
      this.subscriptions.push(
        this.userService.updateProfileImage(formData).subscribe(
          (event: HttpEvent<any>) => {
            this.reportUploadProgress(event);
          },
          (errorResponse: HttpErrorResponse) => {
            this.toastr.error(errorResponse.error.message)
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
          
            this.toastr.success(`${event.body.firstName}\'s profile image updated successfully`)
            this.fileStatus.status = 'done';
            break;
          } else {
          
            this.toastr.error(`Unable to upload image. Please try again`)
            break;
          }
        default:
          `Finished all processes`;
      }
    }
    public updateProfileImage(): void {
      this.clickButton('profile-image-input');
    }
    public onLogOut(): void {
      this.authenticationService.logOut();
      this.router.navigate(['/login']);
    
      this.toastr.success(`You've been successfully logged out`)
    }

    public onResetPassword(emailForm: NgForm): void {
      this.refreshing = true;
      const emailAddress = emailForm.value['reset-password-email'];
      this.subscriptions.push(
        this.userService.resetPassword(emailAddress).subscribe(
          (response: CustomHttpRespone) => {
          
            this.toastr.success(response.message)
            this.refreshing = false;
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(error.error.message)
            this.refreshing = false;
          },
          () => emailForm.reset()
        )
      );
    }

    public onDeleteUder(username: string): void {
      this.subscriptions.push(
        this.userService.deleteUser(username).subscribe(
          (response: CustomHttpRespone) => {
             this.toastr.success(response.message)
             this.gotToPage('',0,this.SelectedNoOfRecords)
           // this.getUsers(false);
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(error.error.message)
          }
        )
      );
    }
    public onEditUser(editUser: User): void {
      this.editUser = editUser;
      this.currentUsername = editUser.username;
      this.clickButton('openUserEdit');
    }

    public searchUsers(searchTerm: string): void {
      const results: User[] = [];
      for (const user of this.userService.getUsersFromLocalCache()) {
        if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
            user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
            user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
            user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            results.push(user);
        }
      }
      this.users = results;
      if (results.length === 0 || !searchTerm) {
        this.users = this.userService.getUsersFromLocalCache();
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
