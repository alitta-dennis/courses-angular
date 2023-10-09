import { Component, OnInit } from '@angular/core';
//import { course } from '../courses/course';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

interface course {
  id: number;
  courseName: string;
  courseCode: string;
  startDate: string;
  price:number;
  starRating:number;
  imageUrl:string;
  category:number|null;
  
}
@Component({
  selector: 'pm-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  email: string|undefined;
  courses:course[]=[];
  


  constructor(private http: HttpClient,private authService:AuthService, private router:Router, private route: ActivatedRoute,){}

  ngOnInit(): void {
    this.getCart();
    console.log(this.courses);
  }

  getCart()
  {
    const token=this.authService.getToken();
    const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`);
    this.http.get<any>("http://127.0.0.1:8000/api/cart/view",{headers}).subscribe(data=>{
      this.email=data.email;
      this.courses=data.courses;
    });
  }

  remove(id:number)
  {
    const token=this.authService.getToken();
    const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`);
    this.http.post<any>(`http://127.0.0.1:8000/api/cart/delete/${id}`,{},{headers}).subscribe(()=>{
      alert(`Removed from cart`);
      this.getCart();
    },
    (error)=> {
      console.log(error);
      alert(`error!`)});
  }

  onBack(): void {
    this.router.navigate(['/courses']);
  }
}
