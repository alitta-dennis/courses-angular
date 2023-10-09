import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject} from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { course } from './course';
import { CourseService} from './course.service';

describe('CourseService',()=>{
    let httpTestingController:HttpTestingController;
    let courseService: CourseService;
    let baseUrl="api/courses";
    let mockCourse:course;

    beforeEach(()=>{
        TestBed.configureTestingModule({
            //providers:[CourseService],
            imports:[HttpClientTestingModule]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        mockCourse={
            id:2,
            courseName:'Artificial Intelligence',
            courseCode:'cst234',
            startDate:'November 15,2023',
            price:15,
            starRating:3,
            imageUrl:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.zdnet.com%2Farticle%2Fwhat-is-ai-heres-everything-you-need-to-know-about-artificial-intelligence%2F&psig=AOvVaw02jYVHOd0PzEOSs-kAOCvm&ust=1696674938161000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMCD6-mc4YEDFQAAAAAdAAAAABAD",
            category:36
        };
    });
        beforeEach(inject(
          [CourseService],
          (service: CourseService)=>{
            courseService=service;
          }  
        ));
    });

    it("should return data",()=>{
        let result:course[];
        courseService.getCourses().subscribe(data=>{
            result=data;
        });
    })

    // afterEach(()=>{
    //     httpTestingController.verify();
    // });

// describe('#createCourse()',()=>{
//     let httpTestingController:HttpTestingController;
//     let service: CourseService;

    // it('returned observable should match the data',()=>{
    //     let result:course[];
    //     service.getCourses().subscribe(data=>{
    //         result=data;
    //     });

   
    // })
