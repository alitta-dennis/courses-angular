import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http:HttpClient, private authService:AuthService){  }

  add(id:number):Observable<any>
  {
    const token=this.authService.getToken();
    const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`);
    console.log(token);
    const baseurl="http://127.0.0.1:8000/api/cart/add";
    const url= `${baseurl}/${id}`;
    return this.http.post(url,{},{headers});

  }
}
