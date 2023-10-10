import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { course } from './course';
import { CourseService } from './course.service';

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';

import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  templateUrl: './course-edit.component.html'
})
export class CourseEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  pageTitle = 'Course Edit';
  errorMessage = '';
  courseForm!: FormGroup;

  Course!: course;
  private sub!: Subscription;

  selectedImageFile: File |null=null;
  nameSelected: string | null = null;
  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  

  

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private courseService: CourseService,
              private authService:AuthService,
              private http:HttpClient) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      courseName: {
        required: 'Course name is required.',
        minlength: 'Course name must be at least three characters.',
        maxlength: 'Course name cannot exceed 50 characters.'
      },
      courseCode: {
        required: 'Course code is required.'
      },
      // startDate:{ required: 'Start Date is required.'},
      // price:{ required: 'Price is required.'},
    

      starRating: {
     range: 'Rate the product between 1 (lowest) and 5 (highest).'
       }
      //  imageUrl: {
      //   range: 'Rate the product between 1 (lowest) and 5 (highest).'
      //     },
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {

    this.fetchCategories();
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required,
                         Validators.minLength(3),
                         Validators.maxLength(50)]],
      courseCode: ['', Validators.required],
      startDate: [''],
      price:'',
      starRating: ['', NumberValidators.range(1, 5)],
       imageUrl: [''],
       categoryId:[null]
      // tags: this.fb.array([]),
      // description: ''
    });

    // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.getCourse(id);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.courseForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.courseForm);
    });
  }


  getCourse(id: number): void {
    console.log(id)
    this.courseService.getCourse(id)
      .subscribe({
        next: (Course: course) => this.displayCourse(Course),
        error: err => this.errorMessage = err
      });
  }

  displayCourse(Course: course): void {
    if (this.courseForm) {
      this.courseForm.reset();
    }
    this.Course = Course;

    if (this.Course.id === 0) {
      this.pageTitle = 'Add Course';
    } else {
      this.pageTitle = `Edit Course: ${this.Course.courseName}`;
    }

    // Update the data on the form
    this.courseForm.patchValue({
      courseName: this.Course.courseName,
      courseCode: this.Course.courseCode,
       starRating: this.Course.starRating,
       startDate: this.Course.startDate,
      price: this.Course.price,
      category: this.Course.category,
      imageUrl: this.Course.imageUrl,
    });
  
  }

  deleteCourse(): void {
    if (this.Course.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else if (this.Course.id) {
      if (confirm(`Are you sure you want to delete the course, ${this.Course.courseName}?`)) {
        this.courseService.deleteCourse(this.Course.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  // saveCourse(): void {
  //   if (this.courseForm.valid) {
  //     if (this.courseForm.dirty) {
  //       const p = { ...this.Course, ...this.courseForm.value };

  //       if (p.id === 0) {
  //         this.courseService.createCourses(p)
  //           .subscribe({
  //             next: x => {
  //               console.log(x);
  //               return this.onSaveComplete();
  //             },
  //             error: err => this.errorMessage = err
  //           });
  //       } else {
  //         this.courseService.updateCourse(p)
  //           .subscribe({
  //             next: () => this.onSaveComplete(),
  //             error: err => this.errorMessage = err
  //           });
  //       }
  //     } else {
  //       this.onSaveComplete();
  //     }
  //   } else {
  //     this.errorMessage = 'Please correct the validation errors.';
  //   }
  // }
  onImageChange(event:any):void{
    const file=event.target.files[0];
    this.selectedImageFile=file;
  }

  
  idSelected: number | null = null;
  categories: any[] = []; 

  fetchCategories(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get('http://127.0.0.1:8000/api/category', { headers }).subscribe((data: any) => {
      this.categories = data;
    });
  }
  onChange(event: any): void {
    const idSelected = event.target.value;
    this.nameSelected = this.categories.find(category => category.id === idSelected)?.name;
  }
  saveCourse():void{
    if(this.courseForm.valid){
      if(this.courseForm.dirty){
        const courseData={...this.Course,...this.courseForm.value};
        this.idSelected=courseData.categoryId;
        this.nameSelected=this.categories.find(category=>category.id===this.idSelected)?.name;
        console.log('Selected Image File:',this.selectedImageFile);
        console.log('Selected Image name:',this.selectedImageFile?.name);
        const formData=new FormData;
        formData.append('courseName',courseData.courseName);
        formData.append('courseCode',courseData.courseCode);
        formData.append('startDate',courseData.startDate);
        formData.append('price',courseData.price);
        formData.append('starRating',courseData.starRating);

        if(this.nameSelected!==null){
          formData.append('categoryName',this.nameSelected);
        }

        if(this.selectedImageFile){
          formData.append('image',this.selectedImageFile,this.selectedImageFile.name);
        }
          if (courseData.id === 0) {
              this.courseService.createCourses(formData)
                .subscribe({
                  next: x => {
                    console.log(courseData);
                    return this.onSaveComplete();
                    },
                    error: err => this.errorMessage = err
                  });
                }else{
                  //edit with image
                  console.log(courseData.id);
                  if(this.selectedImageFile){
                    this.courseService.updateCourseWithImg(courseData.id,formData)
                    .subscribe({
                      next:()=>this.onSaveComplete(),
                      error:err=>this.errorMessage=err
                    });
                  }else{
                    //edit without image
                    this.courseService.updateCourse(courseData)
                    .subscribe({
                      next: ()=>this.onSaveComplete(),
                      error:err=>this.errorMessage=err
                    });
                  }
                }
              }
              else{
                this.onSaveComplete();
              }
      
    } else{
        this.errorMessage='Please provide valid entries.'
      }
    }
  

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.courseForm.reset();
    this.router.navigate(['/courses']);
  }
}
