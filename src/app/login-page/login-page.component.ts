import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit{
  public loginForm: FormGroup

  constructor(private formbuilder: FormBuilder,
              private http: HttpClient, 
              private router: Router, 
              private authService: AuthService) {
                this.loginForm = this.formbuilder.group({
                  email: [''],
                  password: ['', Validators.required]
                })
               }

  ngOnInit(): void {
   
  }
  

  login() {
    console.log(this.loginForm.value)
    const data={
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    // this.http.post<any>("http://localhost:3000/signupUsersList", this.loginForm.value)
    this.http.post<any>("http://127.0.0.1:8000/api/login",data)
      .subscribe((response)=>{
            
            const jwt=response.token;
            const helper=new JwtHelperService();
            const payload=helper.decodeToken(jwt);
            //const fname = user.fname;
            //const message=response.message;
            
            this.authService.setToken(jwt);
            alert(`Welcome`);
            this.authService.login();
            console.log("logged in");

            const isAdmin=payload.roles.includes('ROLE_ADMIN');
            this.authService.setAdmin(isAdmin);
            this.loginForm.reset();
            this.router.navigate(["courses"]);
          
        },
        (error) => {
          alert("Something went wrong");
        }
      );
  }

  logout() {
    // Call the logout method from AuthService
    
  }
  
}
