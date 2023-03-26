import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UserProfile } from '../model/user-profile';

@Injectable({providedIn: 'root'})
export class UserProfileService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}


  public addUserProfile(formData: FormData): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.host}/userProfile/register`, formData);
  }

  public updateUserProfile(formData: FormData): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.host}/userProfile/update`, formData);
  }
  public getUserProfileOfCurrentUser(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.host}/userProfile/find/${userId}`);
  }

  public createUserProfileFormDate( userProfile: UserProfile, userId:string): FormData {
    const formData = new FormData();
    formData.append('about', userProfile.about);
    formData.append('job',userProfile.job );
    formData.append('company', userProfile.company);
    formData.append('country', userProfile.country);
    formData.append('address', userProfile.address);
    formData.append('phone', userProfile.phone);
    formData.append('emailProfile', userProfile.emailProfile);
    formData.append('twitterProfile', userProfile.twitterProfile);
    formData.append('facebookProfile', userProfile.facebookProfile);
    formData.append('instagramProfile', userProfile.instagramProfile);
    formData.append('linkedinProfile', userProfile.linkedinProfile);
    formData.append('userId',userId);
   
    return formData;
  }
 

}
