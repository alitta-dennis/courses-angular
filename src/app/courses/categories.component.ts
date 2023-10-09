import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'pm-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories:any[]=[];
  idSelected:number|null=null;
  nameSelected:string='';
  courses:any[]=[];

  constructor(private http: HttpClient, private authService:AuthService){}

  ngOnInit(): void{
    const token=this.authService.getToken();
    const headers=new HttpHeaders({'Content-Type':'application/json','Authorization':`Bearer ${token}`})
    //const headers=new HttpHeaders().set('Authorizaton',`Bearer ${token}`);
    console.log("category");
    console.log(token);
    console.log(headers);
    this.http.get('http://127.0.0.1:8000/api/category',{headers}).subscribe((data:any)=>{
    this.categories=data;
    console.log("inside get");
  });
}

  onChange(): void{
    if(this.idSelected!==null)
    {
      const categoryId= +this.idSelected;
      const url=`http://127.0.0.1:8000/api/category/${categoryId}`;
      
      const token=this.authService.getToken();
      const headers=new HttpHeaders({'Content-Type':'application/json','Authorization':`Bearer ${token}`})
      //const headers=new HttpHeaders().set('Authorizaton',`Bearer ${token}`);

      this.http.get(url,{headers}).subscribe((data:any)=>{
        this.courses=data;
  });

    const categorySelected=this.categories.find(category=>category.id===categoryId);
    this.nameSelected=categorySelected ? categorySelected.name: '';
  }
  else{
    this.courses=[];
    this.nameSelected='';
  }
  }
  

}
