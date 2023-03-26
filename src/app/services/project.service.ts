import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserProfile } from '../model/user-profile';
import { Project } from '../model/Project';
import { CustomHttpRespone } from '../model/custom-http-response';
import { ApiResponse } from '../interface/api-response';
import { PageOfProject } from '../interface/PageOfProject';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ProjectService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}


  projects$ = (name: string = '', page: number = 0, size: number = 10 ): Observable<ApiResponse<PageOfProject>> => 
    this.http.get<ApiResponse<PageOfProject>>(`${this.host}/project/list?name=${name}&page=${page}&size=${size}`);

  public addProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(`${this.host}/project/register`, formData);
  }

  public updateProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(`${this.host}/project/update`, formData);
  }
  public getProjectById(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.host}/project/find/${userId}`);
  }
  public deleteProject(id: string): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/project/delete/${id}`);
  }

  public createProjectFormDate( project: Project): FormData {
    const formData = new FormData();
    formData.append('name',project.name );
    formData.append('duration', project.duration);
    formData.append('budget', project.budget.toString());
    formData.append('areaOfImplemenation', project.areaOfImplemenation);
    formData.append('location', project.location);
    formData.append('projectId', project.projectId);
    formData.append('noOfClients', project.noOfClients.toString());
    formData.append('link', project.link);
    formData.append('noOfPayments', project.noOfPayments.toString());
    return formData;
  }
  public updateProjectFormDate( project: Project): FormData {
    const formData = new FormData();
    formData.append('id',project?.id.toString() );
    formData.append('name',project.name );
    formData.append('duration', project.duration);
    formData.append('budget', project.budget.toString());
    formData.append('areaOfImplemenation', project.areaOfImplemenation);
    formData.append('location', project.location);
    formData.append('projectId', project.projectId);
    formData.append('noOfClients', project.noOfClients.toString());
    formData.append('link', project.link);
    formData.append('noOfPayments', project.noOfPayments.toString());
    return formData;
  }
 
  
 

}
