import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailComponent } from './course-detail.component';
import { CourseService } from './course.service';

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create course-detail component",()=>{
    expect(component).toBeTruthy();
  });

  // it("should use course service",()=>{
  //   const courseService=fixture.debugElement.injector.get(CourseService);
  //   fixture.detectChanges();
  //   expect(courseService.getCourses()).toEqual(component.courseInfo);
  // })
});
