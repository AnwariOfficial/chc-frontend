import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../model/Project';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private product$ = new BehaviorSubject<Project>(null);
  selectedProduct$ = this.product$.asObservable();
  constructor() {}

  setProduct(product: Project) {
    this.product$.next(product);
  }
}
