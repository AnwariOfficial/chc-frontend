import { Component, OnInit } from '@angular/core';
import { Project } from '../model/Project';
import { SharedService } from '../services/shared.service';



@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  selectedProject: Project;
  link:string;

  constructor(private productService: SharedService){}
  ngOnInit(): void {
    this.productService.selectedProduct$.subscribe((value) => {
      console.log(value)
      this.selectedProject = value;

    });
  }
  
  }

