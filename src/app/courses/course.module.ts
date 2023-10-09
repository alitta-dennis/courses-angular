import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

// Imports for loading & configuring the in-memory web api
//import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { CourseData } from './product-data';

import { CourseListComponent } from './course-list.component';
import { CourseDetailComponent } from './course-detail.component';
import { CourseEditComponent } from './course-edit.component';
import { CourseEditGuard } from './course-edit.guard';
import { AuthGuard } from '../route.guard';
import { CategoriesComponent } from './categories.component';
//import { AdminGuard } from '../admin.guard';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    //InMemoryWebApiModule.forRoot(CourseData),
    RouterModule.forChild([
      { path: 'courses', canActivate:[AuthGuard], component: CourseListComponent },
      { path: 'courses/:id',  component: CourseDetailComponent },
      { path: 'categories',canActivate:[AuthGuard], component: CategoriesComponent},
      {
        path: 'courses/:id/edit',
        
        //canActivate: [AdminGuard],
        canDeactivate: [CourseEditGuard],
        component: CourseEditComponent
      }
    ])
  ],
  declarations: [
    CourseListComponent,
    CourseDetailComponent,
    CourseEditComponent,
    CategoriesComponent
  ]
})
export class CourseModule { }
