import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/videoGames';
import { Sale } from 'src/app/models/sale';

@Injectable({
  providedIn: 'root'
})
export class VideoGamesService {

  constructor(private http:HttpClient){}

  //-------------------Database products methods-------------------

  urlproducts  = "http://localhost:3025/stock/products"

  getVideoGames(): Observable<any>{
    return this.http.get(this.urlproducts);
  }

  getVideoGame(id: any): Observable<any>{
    return this.http.get(`${this.urlproducts}/${id}`);
  }

  getVideoGameTitle(title: any): Observable<any>{
    console.log(`${this.urlproducts}/title/${title}`);
    return this.http.get(`${this.urlproducts}/title/${title}`);
  }

  getVideoGameGenre(genre: any): Observable<any>{
    console.log(`${this.urlproducts}/genre/${genre}`);
    return this.http.get(`${this.urlproducts}/genre/${genre}`);
  }
  
  putProduct(id: string, product: Product):Observable<any>{
		return this.http.put(`${this.urlproducts}/${id}`, product);
	}

  //-------------------Database sales methods-------------------
  
  urlsales  = "http://localhost:3025/sales/"
  
  postSale(sale: Sale): Observable<any>{
    return this.http.post(this.urlsales, sale);
  }
  
  getSales(): Observable<any>{
    return this.http.get(this.urlsales);
  }
  
  //-------------------Database contact methods-------------------
  
  urlcontact  = "http://localhost:3025/contact/"
  
  postContact(contact: any): Observable<any>{
    return this.http.post(this.urlcontact, contact);
  }
  
  getContacts(): Observable<any>{
    return this.http.get(this.urlcontact);
  }
  
  getContact(id: any): Observable<any>{
    return this.http.get(this.urlcontact, id);
  }
}
