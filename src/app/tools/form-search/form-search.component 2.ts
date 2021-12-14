import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-search',
  template: `<input #inputSearch type="text" class="form-control-lg" placeholder="Search the game you want" (keyup)="onSearch(inputSearch.value)">`,
  styleUrls: ['./form-search.component.css']
})
export class FormSearchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
onSearch(value: string){
  console.log("search ->", value)
  //TODO:
 if(value && value.length > 3){
   this.router.navigate(['/products'], {
     queryParams:{q:value},
   })
 }
}
}
