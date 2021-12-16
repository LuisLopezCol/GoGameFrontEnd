import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VideoGamesService } from 'src/app/services/video-games.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Sale } from 'src/app/models/sale';
import Swal from 'sweetalert2';

enum CheckBoxType { VISA, MAESTRO, AMERICAN, PAYPAL, APPLE, GOOGLE, APPLY_FOR_JOB, MODIFY_A_JOB, NONE };

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  //----------------------Properties----------------------
  //Array of products in the cart
  carProduct: any;
  //Cart total USD $ 
  cartTotal: number = 0;
  //Total Items in the cart
  itemsTotal: number = 0;
  //Reactive Form
  deliveryForm: FormGroup;
  paymentForm: FormGroup;
  dateMonthYear = /^(0[1-9]|1[0-2])\/[0-9]{2}/;
  numericValue = /^[0-9]+$/;
  //To be uesd to store the JOSN imported from the DB
  // sale: Sale[] = [];
  sale: any = {};
  //Select only one checkbox
  check_box_type = CheckBoxType;
  currentlyChecked?: CheckBoxType;
  //Authenticaion
  userLogged=this.authService.getUserLogged();
  
  constructor(private authService: AuthService, private renderer2:Renderer2, private formBuilder: FormBuilder, private router: Router ,private videoGamesSvc:VideoGamesService){
    //Creating group for the validation of the form for checking out and payment
    this.deliveryForm = this.formBuilder.group({
    name: ['',Validators.required],
    email: ['',[Validators.required, Validators.email]],
    state: ['',Validators.required],
    city: ['',Validators.required],
    address: ['',Validators.required],
    zipcode: ['',Validators.required],
    cellphone: ['',[Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(this.numericValue)]],
    references: [''],
  });
    this.paymentForm = this.formBuilder.group({
    // cardtype: ['',Validators.required],
    cardname: ['',Validators.required],
    cardnumber: ['',[Validators.required, Validators.maxLength(12), Validators.minLength(12), Validators.pattern(this.numericValue)]],
    cardexpire: ['',[Validators.required, Validators.pattern(this.dateMonthYear)]],
    cardcode: ['',[Validators.required, Validators.maxLength(4), Validators.minLength(3), Validators.pattern(this.numericValue)]],
  });
  }

  //----------------------Show & Hide cart----------------------
  ngOnInit(): void {
    setTimeout(()=>{
      this.SetCartValues()
      this.GetProduct();
    },500)
    this.carProduct = JSON.parse(localStorage.getItem('products') as string) //si no dejo la funcion aca  no me carga
    console.log(this.carProduct); //PENDIENTE POR REVISAR
    this.CartTotal();
    this.CartItem();
  }
  
  //--------------------Modify the Local Storage--------------------//  
  //Bring the cart content from the LS to the program
  GetProduct() {
    return this.carProduct = JSON.parse(localStorage.getItem('products') as string)
  }      
  //Save the cart content to the LS
  SaveCart() {
    return localStorage.setItem("products", JSON.stringify(this.carProduct));
  }      
  //Remove an specific product
  RemoveProduct(target: any){
    //Bring the cart content from the LS to the program
    this.GetProduct();
    //Search and delete the element in the array to be removed
    for (var i = 0; i < this.carProduct.length; i++){
      if (this.carProduct[i]._id === target) {
        this.carProduct.splice(i,1);
        this.HideCart();
        break;
      }}
    //Save the updated array in the LS
      this.SaveCart();
      // if (this.carProduct == null) {
      //   this.ClearAllProducts
      // }
  }
  //Remove all products
  AreYouSureDeleteCart(){
    Swal.fire({
      title: '¿Are you sure to clear the cart?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ClearAllProducts();
        this.HideCart();
        Swal.fire(
          'Deleted!',
          'Your cart has been cleared.',
          'success'
        )
      }
    })
  }
  ClearAllProducts() {
    this.carProduct = JSON.parse(localStorage.getItem("products")!);
    localStorage.removeItem("products");
    //Uptade the cart
    setTimeout(()=>{
      this.SetCartValues();
      this.GetProduct();
    },500)
    this.CartItem();
  }
    
  //--------------------Modify the content in the cart--------------------//
  //Render the whole cart for the user
  SetCartValues() {
    this.cartTotal = 0;
    setTimeout(()=>{
    if(localStorage.getItem('products') != null){
      this.carProduct.forEach((a: any) => this.cartTotal += a.stock);
    }
  },100)
    //Update the total USD$ of the cart
    this.CartTotal()
    //Update the total of items in the cart
    this.CartItem();
  }
  //Update the total money in the cart
  CartTotal(){
    //Getting the array of objects
    this.GetProduct();
    //Search and decrease the amount of the product by one
    this.cartTotal = 0;  
    if(this.carProduct != null){
      for (var i =0; i < this.carProduct.length; i++){
        let tempAmount = parseInt(this.carProduct[i].amount);
        let tempPrice = parseInt(this.carProduct[i].price);
        this.cartTotal += tempAmount*tempPrice;
        }
      }
      return this.cartTotal
  }
  //Update the total of items in the cart
  CartItem(){
    //Getting the array of objects
    this.GetProduct();
    //Populate the total items in the cart
    this.itemsTotal = 0;  
    setTimeout(() => {if(this.carProduct != null){
      for (var i =0; i < this.carProduct.length; i++){
        let tempAmount = parseInt(this.carProduct[i].amount);
        this.itemsTotal += tempAmount;}}}, 100);
  }
  //Increase the amount of the product in the cart
  IncreaseProduct(target: any){
    //Getting the array of objects
    this.GetProduct();
    //Search and increase the amount of the product by one
    for (var i =0; i < this.carProduct.length; i++){
      if (this.carProduct[i]._id === target) {
        let temp = parseInt(this.carProduct[i].amount);
        //Check if there are enough stock
        if (temp < this.carProduct[i].stock) {
          temp += 1;
          this.carProduct[i].amount = temp;
          break;
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Sorry! we do not have more stock',
            showConfirmButton: false,
            timer: 2000
          })
        }
      }}
    //Save the updated array in the LS
    this.SaveCart();
    //Update the total USD$ of the cart
    this.CartTotal()
    //Update the total of items in the cart
    this.CartItem();
  }
  //Increase the amount of the product in the cart
  DecreaseProduct(target: any){
    //Getting the array of objects
    this.GetProduct();
    //Search and decrease the amount of the product by one
    for (var i =0; i < this.carProduct.length; i++){
      if (this.carProduct[i]._id === target) {
        let temp = parseInt(this.carProduct[i].amount);
        //Check if there is one or less, if not remove the item
        if(temp > 1){
          temp -= 1;
          this.carProduct[i].amount = temp;
          break;
        }else{
          this.RemoveProduct(target);
          break;
        }
      }}
    //Save the updated array in the LS
    this.SaveCart();
    //Update the total USD$ of the cart
    this.CartTotal();
    //Update the total of items in the cart
    this.CartItem();
  }
    
  //--------------------Show and close the cart--------------------//
  //Decorators to modify the DOM
  @ViewChild("cartOverlay") cartOverlay!: ElementRef;
  @ViewChild("cartDom") cartDom!: ElementRef;
  @ViewChild("delivery") delivery!: ElementRef;
  @ViewChild("payment") payment!: ElementRef;
  //Show the cart when the cart button is pressed
  ShowCart(){
    this.GetProduct();
    console.log(this.carProduct);
    
    if (this.carProduct == null || this.carProduct.length == 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: '¡Sorry! your cart is empty',
        showConfirmButton: false,
        timer: 2000
      })}
    else{
      this.SetCartValues();
      // setTimeout(()=>{
        const cartOverlay = this.cartOverlay.nativeElement;
        this.renderer2.addClass(cartOverlay,"transparentBcg");
        const cartDom = this.cartDom.nativeElement;
        this.renderer2.addClass(cartDom,"showCart");
      // },00)
      setTimeout(()=>{
        this.CartTotal();
      },100)
    }
  }
  //Hide the cart when the closed button is pressed
  HideCart(){
    this.RemoveDelivery();
    this.RemovePayment();
    const cartOverlay = this.cartOverlay.nativeElement;
    this.renderer2.removeClass(cartOverlay,"transparentBcg");
    const cartDom = this.cartDom.nativeElement;
    this.renderer2.removeClass(cartDom,"showCart");
  }
  //When confirm the purschase it will redirect to delivery info
  ShowDelivery(){
    this.SetCartValues()
    this.GetProduct();
    setTimeout(()=>{
      const delivery = this.delivery.nativeElement;
      this.renderer2.addClass(delivery,"showDelivery");
      this.CartTotal();
    },100)
    localStorage.setItem("sale", JSON.stringify(this.carProduct));
    for (var i = 0; i < this.carProduct.length; i++){
      let tempAmount = 0;
      this.carProduct[i].amount = tempAmount;
      this.carProduct[i].total = tempAmount*this.carProduct[i].price;}
    }
  //If the user needs to revert the Delivery Info
  RemoveDelivery(){
    const delivery = this.delivery.nativeElement;
    this.renderer2.removeClass(delivery,"showDelivery");
  }
  //After confirm the information, it will proceed to pay
  ShowPayment(){
    setTimeout(()=>{
      const payment = this.payment.nativeElement;
      this.renderer2.addClass(payment,"showPayment");
    },100)
  }
  //If the user needs to revert the payment method
  RemovePayment(){
    const payment = this.payment.nativeElement;
    this.renderer2.removeClass(payment,"showPayment");
  }
    //Select only one checkbox
    paymenttype: any = String;
  selectCheckBox(targetType: CheckBoxType) {
    // If the checkbox was already checked, clear the currentlyChecked variable
    if(this.currentlyChecked === targetType) {
      this.currentlyChecked = CheckBoxType.NONE;
      this.paymenttype = targetType;
      console.log(this.paymenttype);
      
      return;
    }
    this.paymenttype = targetType;
    console.log(this.paymenttype);
    this.currentlyChecked = targetType;
  }
  //Close everything remove the cart from LS, alert the User that the sale has been made and update the stock in the DB
  CheckoutComnpleted(){
    this.postSale();
    this.updateStock();
    this.HideCart();
    this.RemovePayment();
    this.RemoveDelivery();
    this.ClearAllProducts();
    setTimeout(() => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Thanks for your purchase',
        text: `Yout tracking number is ${this.trackingnumber}`,
        showConfirmButton: true,
        // timer: 4000
      })}, 500);
    //Clean the forms and the LS
    this.paymentForm.reset();
    this.deliveryForm.reset();
    localStorage.removeItem('products');
    localStorage.removeItem('sale');
  }  
  //-----Data from reactive form-----
  //Save the sale in the data base
  cardtype: any;
  trackingnumber: any;
  postSale(){
    //Getting which card type was used
   if(this.paymenttype = 0){
      this.cardtype = "VISA";
    }else if (this.paymenttype = 1){
      this.cardtype = "MAESTRO";
    }else if (this.paymenttype = 2){
      this.cardtype = "AMERICAN";
    }else if (this.paymenttype = 3){
      this.cardtype = "PAYPAL";
    }else if (this.paymenttype = 4){
      this.cardtype = "APPLE";
    }else if (this.paymenttype = 5){
      this.cardtype = "GOOGLE";} 
    //Sending the personal info to the json of the DB
    const SALE: Sale = {
      name: this.deliveryForm.get('name')?.value,
      email: this.deliveryForm.get('email')?.value,
      state: this.deliveryForm.get('state')?.value,
      city: this.deliveryForm.get('city')?.value,
      address: this.deliveryForm.get('address')?.value,
      zipcode: this.deliveryForm.get('zipcode')?.value,
      cellphone: this.deliveryForm.get('cellphone')?.value,
      references: this.deliveryForm.get('references')?.value,
      paymenttype: this.cardtype,
      cardname: this.paymentForm.get('cardname')?.value,
      cardnumber: this.paymentForm.get('cardnumber')?.value,
      cardexpire: this.paymentForm.get('cardexpire')?.value,
      cardcode: this.paymentForm.get('cardcode')?.value,}
    this.sale.costumerinfo = SALE;
    //Find the total items in the cart
    let tempAmount = 0;
    for (var i = 0; i < this.carProduct.length; i++){
      tempAmount += this.carProduct[i].amount}
    this.sale.totalitems = tempAmount;    
    //Save the products sold in the json for the DB
    let dataProduct = localStorage.getItem('products');
    this.sale.products = JSON.parse(dataProduct!);
    //Save the total USD sold in the json for the DB
    this.sale.totalsale = this.cartTotal;
    //Save the data in the DB and show the sale tracking number
    this.videoGamesSvc.postSale(this.sale).subscribe(
      data => {console.log("success!", data);
      this.trackingnumber = data._id;
      console.log(this.trackingnumber)},
      error => console.error("couldn't post", error));
  }
  updateStock(){
    this.GetProduct();
    for (var i = 0; i < this.carProduct.length; i++){
      this.carProduct[i].stock -=  this.carProduct[i].amount;
      this.videoGamesSvc.putProduct(this.carProduct[i]._id, this.carProduct[i]).subscribe(
      data => {console.log("success!", data);
      this.trackingnumber = data._id},
      error => console.error("couldn't post", error));
    }
  }

  // Temporal
 
  logout(){
    this.authService.logout();
  }



}