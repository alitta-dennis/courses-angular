import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { CourseModule } from './courses/course.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { AppNavbarComponent } from './app-navbar.component';

import { AuthGuard } from './route.guard';
import { AuthService } from './auth.service';
import { CartComponent } from './cart/cart.component';
import { AdminComponent } from './admin/admin.component';
//import { CategoriesComponent } from './courses/categories.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LoginPageComponent,
    SignupPageComponent,
    AppNavbarComponent,
    CartComponent,
    AdminComponent,
    //CategoriesComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent },
      { path: 'login', component:LoginPageComponent},
      { path: 'signUp', component:SignupPageComponent},
      { path: 'cart',canActivate:[AuthGuard],  component:CartComponent},
      {path: 'admin',canActivate:[AuthGuard], component:AdminComponent},
      //{ path: 'logout', component: LogoutComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', redirectTo: 'welcome', pathMatch: 'full'} 
     
    ]),
    CourseModule
  ],
  providers:[AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

