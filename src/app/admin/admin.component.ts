import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {HttpClient,HttpHeaders} from '@angular/common/http'; 
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'pm-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  //iframeUrl: SafeResourceUrl| undefined;

  constructor(private authService: AuthService,
              private router: Router,
              private http: HttpClient ){}
  ngOnInit(): void {
            const token=this.authService.getToken();
            const url='http://127.0.0.1:8000/admin';

            const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`);

            this.http.get(url,{headers}).subscribe(
              (response:any)=>{},
              (error)=>{console.error(error);
              if (error.status===401){
                  this.router.navigate(['/login']);
              }
            }
            )
      
    }
  }


