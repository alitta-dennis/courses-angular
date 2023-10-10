
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {
  public signUpForm !: FormGroup
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      // fname: ["", Validators.required],
      // phone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]]
    })
  }


  // signUp() {
  //   if (this.signUpForm.valid){
  //   console.log(this.signUpForm.value);
  //   this.http.post<any>("http://localhost:3000/signupUsersList", this.signUpForm.value)
  //     .subscribe({
  //       next: (res) => {
  //         alert('Sign Up Successful');
  //         this.signUpForm.reset();
  //         this.router.navigate(["login"]);
  //       },
  //       error: (err) => {
  //         alert("Something went wrong");
  //       }
  //     });
  //   }
  //   else {
  //     alert("Please enter all the required values.")
  //   }
  // }
  

  signUp() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
  
      // Check if the email already exists before submitting the form
      // this.http.get<any>("http://127.0.0.1:8000/api/register").subscribe({
      //   next: (users) => {
          // Check if the email already exists in the list of users
          //const emailExists = users.some((user: { email: any; }) => user.email === this.signUpForm.value.email);
          // if (emailExists) {
          //   alert("User already exists!!");
          // } else 
          {
            // Email doesn't exist, proceed with sign up
            this.http.post<any>("http://127.0.0.1:8000/api/register", this.signUpForm.value).subscribe({
              next: (res) => {
                alert('Sign Up Successful');
                this.signUpForm.reset();
                this.router.navigate(["login"]);
              },
              error: (err) => {
                if(err.status===409){
                  alert('User already exists!!')
                }
                else{
                alert("Error in sign-up!");}
              }
            });
          }
        }
        // error: (err) => {
        //   alert("Something went wrong while checking email availability.");
        // }
      };
    } 
    // else {
    //   alert("Please enter all the required values.");
    
 

