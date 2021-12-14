import { Component, OnInit, ElementRef } from '@angular/core';
import brandsDB from "../home/brands.json"


interface Brands{
  id: Number;
  imagen: String;
  link: String
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //Import the JSON with the data to the program 
  brands: Brands[] = brandsDB;


  constructor() { }

  ngOnInit(): void {
  }

}
