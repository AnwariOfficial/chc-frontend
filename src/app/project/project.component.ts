import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, map, Observable, of, startWith, Subject, Subscription } from 'rxjs';
import { ApiResponse } from '../interface/api-response';

import { PageOfProject } from '../interface/PageOfProject';
import { CustomHttpRespone } from '../model/custom-http-response';
import { Project } from '../model/Project';
import { ProjectService } from '../services/project.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  records: number[];

  projectsState$: Observable<{ appState: string, appData?: ApiResponse<PageOfProject>, error?: HttpErrorResponse }>;
  responseSubject = new BehaviorSubject<ApiResponse<PageOfProject>>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  public loadingService: BehaviorSubject<boolean> = new BehaviorSubject(false);
  SelectedNoOfRecords: number = 10;

  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    height: '750',
    plugins: 'lists link image table wordcount advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
  }
  private subscriptions: Subscription[] = [];
  public editProject = new Project();
  public deletedProject = new Project();
  selectedProduct: any;

  constructor(private projectService: ProjectService, private toastr: ToastrService,private productService: SharedService) { }

  ngOnInit(): void {

    this.records = [10, 25, 50, 100];
    this.SelectedNoOfRecords = 10;
    this.projectsState$ = this.projectService.projects$('', 0, this.SelectedNoOfRecords).pipe(
      map((response: ApiResponse<PageOfProject>) => {
        this.loadingService.next(false);
        this.responseSubject.next(response);
        this.currentPageSubject.next(response.data.page.number);
        console.log(response);
        return ({ appState: 'APP_LOADED', appData: response });
      }),
      startWith({ appState: 'APP_LOADING' }),
      catchError((error: HttpErrorResponse) => {
        this.loadingService.next(false);
        return of({ appState: 'APP_ERROR', error })
      }
      )
    )
    
  }
  onSelectedProduct(product:Project) {
    this.productService.setProduct(product);
  }
  getAllProjects() {
    this.gotToPage('', 0, this.SelectedNoOfRecords)
  }
 

  gotToPage(name?: string, pageNumber: number = 0, size?: number): void {
    this.loadingService.next(true);
    this.projectsState$ = this.projectService.projects$(name, pageNumber, this.SelectedNoOfRecords).pipe(
      map((response: ApiResponse<PageOfProject>) => {
        this.loadingService.next(false);
        this.responseSubject.next(response);
        this.currentPageSubject.next(pageNumber);
        console.log(response);
        console.log("------------->>" + size)
        return ({ appState: 'APP_LOADED', appData: response });
      }),
      startWith({ appState: 'APP_LOADED', appData: this.responseSubject.value }),
      catchError((error: HttpErrorResponse) => {
        this.loadingService.next(false);
        return of({ appState: 'APP_ERROR', error })
      }
      )
    )
  }

  goToNextOrPreviousPage(direction?: string, name?: string, no?: number): void {
    this.gotToPage(name, direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1, no);
  }


  public onAddProject(project: NgForm): void {
    console.log(project)
    const formData = this.projectService.createProjectFormDate(project.value);
    this.subscriptions.push(
      this.projectService.addProject(formData).subscribe(
        (response: Project) => {
          console.log('success')
          this.toastr.success(` ${response.name} with  Project ID : ${response.projectId} added successfully`)
          this.gotToPage('', 0, this.SelectedNoOfRecords)
          project.reset();
        },
        (errorResponse: HttpErrorResponse) => {

          this.toastr.error(errorResponse.error.message)
        }
      )
    );
  }
  public updateProject(): void {
    const formData = this.projectService.updateProjectFormDate(this.editProject);
    this.subscriptions.push(
      this.projectService.updateProject(formData).subscribe(
        (response: Project) => {
          this.clickButton('closeEditProjectModalButton');
          this.gotToPage('', 0, this.SelectedNoOfRecords)
          this.toastr.success(`${response.name} updated successfully`)
        },
        (errorResponse: HttpErrorResponse) => {
          this.toastr.error(errorResponse.error.message)
        }
      )
    );
  }
  public deleteProject(): void {
    console.log('deleteProject Clicked')
    this.subscriptions.push(
      this.projectService.deleteProject(this.deletedProject.id.toString()).subscribe(
        (response: CustomHttpRespone) => {
           this.toastr.success(response.message)
           this.gotToPage('',0,this.SelectedNoOfRecords)
           this.clickButton('closeDeleteProjectModalButton');
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error.message)
        }
      )
    );
  }
  onEditProject(project: Project) {
    this.clickButton('openProjectEdit');
    this.editProject = project;

  }
  onDeleteProject(project: Project) {
    this.clickButton('openProjectDelete');
    console.log('Delete clicked')
    this.deletedProject = project;

  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

}
