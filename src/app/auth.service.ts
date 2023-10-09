import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private isAdminUser=false;
  authState = { isAuthenticated: false};

  private token: string | null=null;

  setToken(token:string):void{
    this.token=token;
  }

  getToken():string| null{
    return this.token;
  }

  // Simulate user login
  login() {
    this.authState.isAuthenticated = true;
  }

  setAdmin(isAdmin:boolean)
  {
    this.isAdminUser=isAdmin;
  }

  isAdmin():boolean
  {
    return this.isAdminUser;
  }

  // Simulate user logout
  logout() {
    this.token=null;
    this.authState.isAuthenticated = false;
    this.isAdminUser=false;
   
  }

  // Check if the user is authenticated
  isAuthenticatedUser(): boolean {
    return this.authState.isAuthenticated;
  }

  // isAdminUser():boolean{
  //   return this.authState.isAdmin;
  // }
}
