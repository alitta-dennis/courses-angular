import { Component, OnInit } from '@angular/core';

import { course } from './course';
import { CourseService } from './course.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  pageTitle = 'Course List';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredCourses = this.listFilter ? this.performFilter(this.listFilter) : this.courses;
  }

  filteredCourses: course[] = [];
  courses: course[] = [];

  

  constructor(private courseService: CourseService, private router: Router, private http:HttpClient, private authService:AuthService) { }

  fetchImage(imageUrl: string): void {
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe(response => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Assuming you have an image element in your template with an ID "productImage"
        const imageElement = document.getElementById('image') as HTMLImageElement;
        imageElement.src = reader.result as string;
      };
      reader.readAsDataURL(response);
    });
  }


  performFilter(filterBy: string): course[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.courses.filter((Course: course) =>
      Course.courseName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  // Checks both the product name and tags
  // performFilter2(filterBy: string): course[] {
  //   filterBy = filterBy.toLocaleLowerCase();
  //   return this.courses.filter((Course: course) =>
  //     Course.courseName.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
  //       (Course.tags && Course.tags.some(tag => tag.toLocaleLowerCase().indexOf(filterBy) !== -1)));
  // }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }
  current=1;
  size=10;
  total=0;
  ngOnInit(): void {
    this.loadPage(this.current);
  }

  loadPage(page:number):void{
    this.courseService.getCourses(page,this.size).subscribe({
      next: (response:any) => {
        this.courses = response.data;
        this.total=response.total
        this.filteredCourses = this.courses;
      },
      error: err => this.errorMessage = err
    });
  }

  pageChanged(page:number){
    this.current=page;
    this.loadPage(this.current);
  }
  isAdmin():boolean
  {
    return this.authService.isAdmin();
  }
}
