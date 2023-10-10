
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders,HttpParams } from '@angular/common/http';


import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { course } from './course';

import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  // private coursesUrl = 'http://localhost:3000/coursesList'; // JSON Server endpoint
  private coursesUrl = 'http://127.0.0.1:8000/api/courses';
  private editUrl='http://127.0.0.1:8000/api/courses/img';
  //private adminUrl='http://127.0.0.1:8000/admin';
  constructor(private http: HttpClient,private authService:AuthService) { }

  getCourses(page:number, size:number): Observable<course[]> {

    const token=this.authService.getToken();
    const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`);
    const params= new HttpParams()
                    .set('page',page.toString())
                    .set('size',size.toString());
    const url=`${this.coursesUrl}?${params.toString()}` ;
    //let options = new RequestOptions({ headers: headers });
    return this.http.get<course[]>(url,{headers})
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getCourse(id: number): Observable<course> {
    const token=this.authService.getToken();
    if (id === 0) {
      return of(this.initializeCourse());
    }
    const url = `${this.coursesUrl}/${id}`;
    const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`);
    return this.http.get<course>(url,{headers})
      .pipe(
        tap(data => console.log('getCourse: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createCourses(formData: FormData): Observable<course> {
    const token=this.authService.getToken();
    const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`);
    // const headers = new HttpHeaders({});
    // Course.id = null;
    return this.http.post<course>(this.coursesUrl, formData, { headers }).pipe(
      
      
      tap((data:any)=>{
      console.log('createCourse: ', data);
      }),
        catchError(this.handleError)
      );
  }

  deleteCourse(id: number): Observable<{}> {
    const token=this.authService.getToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json','Authorization':`Bearer ${token}` });
    const url = `${this.coursesUrl}/${id}`;
    return this.http.delete<course>(url, { headers })
      .pipe(
        tap(data => console.log('deleteCourse: ' + id)),
        catchError(this.handleError)
      );
  }

  updateCourse(Course: course): Observable<course> {
    const token=this.authService.getToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json','Authorization':`Bearer ${token}` });
    const url = `${this.coursesUrl}/${Course.id}`;
    return this.http.put<course>(url, Course, { headers })
      .pipe(
        tap(() => console.log('updateCourse: ' + Course.id)),
        // Return the Course on an update
        map(() => Course),
        catchError(this.handleError)
      );
  }

  updateCourseWithImg(Courseid: number,courseData:FormData): Observable<course> {
    
    const url = `${this.editUrl}/${Courseid}`;
    const token=this.authService.getToken();
    const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`);
    return this.http.post<course>(url, courseData,{headers})
      .pipe(
        tap(() => console.log('updateCourse: ' + Courseid)),
        // Return the Course on an update
        map(() => courseData as unknown as course), // Cast FormData to course for simplicity
        catchError(this.handleError)
      );
  }

  // ... Other methods (getCourse, createCourse, deleteCourse, updateCourse) remain the same

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

   private initializeCourse(): course {
    // Return an initialized object
    return {
      id: 0,
      courseName: '',
      courseCode: '',
      startDate:'',
      price:0,
      starRating:0,
      imageUrl:'',
      category:0
      
    };
  }
}

