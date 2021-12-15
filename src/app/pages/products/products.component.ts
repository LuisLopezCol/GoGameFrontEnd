import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { VideoGamesService } from 'src/app/services/video-games.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

  //----------------------Parameters----------------------
  //Pagination
  public page: number = 1;
  //To be uesd to store the JOSN imported from the DB
  listVideoGames: any= [];
  // listVideoGames: videoGameModel[] = [];
  keyCart: any;
  //Total Items in the cart
  itemsTotal: number = 0;
  //Array of products in the cart
  carProduct: any;
  //Initializing the parameter to avoid a bug when initializing the page
  ModalVidoGame: any = {
    "id":4,"title":"CRSED: F.O.A.D.","thumbnail":"https:\/\/www.freetogame.com\/g\/4\/thumbnail.jpg","short_description":"Take the battle royale genre and add  mystical powers and you have CRSED: F.O.A.D. (Aka Cuisine Royale: Second Edition)","game_url":"https:\/\/www.freetogame.com\/open\/crsed","genre":"Shooter","platform":"PC (Windows)","publisher":"Gaijin Distribution KFT","developer":"Darkflow Software","release_date":"2019-12-12","freetogame_profile_url":"https:\/\/www.freetogame.com\/crsed","stock": 50 
  };

  constructor(private renderer2:Renderer2,private videoGamesSvc:VideoGamesService){}
    
  ngOnInit(): void {   
    this.getVideoGames();
    this.GetProduct();
  }
  //--------------------Fetch data from DB--------------------//
  //Fetch the data from the Data Base to the component
  getVideoGames(){
    this.videoGamesSvc.getVideoGames().subscribe((VideoGamesDB) => {  
      this.listVideoGames = VideoGamesDB;
      // console.log(VideoGamesDB);
    }, error =>{
      console.log(error);
    })
  }
  //--------------------Local storage--------------------//
  //Getting the array of objects
  GetProduct() {
    return this.carProduct = JSON.parse(localStorage.getItem('products') as string)
  }   
  //Update the total of items in the cart
  CartItem(){
    //Getting the array of objects
    this.GetProduct();
    //Populate the total items in the cart
    this.itemsTotal = 0;  
    for (var i =0; i < this.carProduct.length; i++){
      let tempAmount = parseInt(this.carProduct[i].amount);
      this.itemsTotal += tempAmount;}}
  //Save a product in the cart when added in the modal
  SaveProducts(game: any) {
    //Adding to the Json the cart amount of the product, since it's new it must be one
    game.amount = 1
    //Adding the json to the LS
    if(localStorage.getItem("products") == null){
      //This first condition is requiered to initialize the cart as an array of objects
      this.keyCart = [];
      this.keyCart.push(game);
      localStorage.setItem("products", JSON.stringify(this.keyCart));
    }else{
      this.keyCart = JSON.parse(localStorage.getItem("products")!);
      this.keyCart.push(game);
      localStorage.setItem("products", JSON.stringify(this.keyCart))};
    //Show the user that the product was added to the cart
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your Video Game has been added',
      showConfirmButton: false,
      timer: 2000})
    //Populate the total of items in the cart
    this.CartItem(); //Not morkin*********
  }
    updateModal(game: any, lectura: boolean){if(lectura){return this.ModalVidoGame = game}};
  //Disable a product if it is already in the cart, this in order to avoid adding it more than once
  @ViewChild("DisableButton") DisableButton!: ElementRef;
  DisableProduct(target: any){
    //Getting the array of objects
    this.GetProduct();
    //Search and confirm that the product is in the cart
    for (var i = 0; i < this.carProduct.length; i++){
      if (this.carProduct[i]._id === target && this.carProduct[i].amount > 0) {
      break;}}
    const DisableButton = this.DisableButton.nativeElement;
    this.renderer2.setAttribute(DisableButton, "disabled", "true");}
  //--------------------Search data from DB--------------------//
  mdlSampleIsOpen : boolean = false;
  searchProduct(title: String, open : boolean) {
    let temp = title.replace(/ /g,"%20");
    this.videoGamesSvc.getVideoGameTitle(temp).subscribe(
      data => {console.log("success!", data);
      this.ModalVidoGame  =  data[0];
      //open the modal if the seacrhing was success
      this.mdlSampleIsOpen = open;
    },error => {
      //alert if the searching was not sucessful
      Swal.fire({position: 'center',
        icon: 'error',
        title: 'Sorry! please check the name',
        showConfirmButton: false,
        timer: 2000})});}
  //Close the modal open by the above method
  closeModal(close: boolean){this.mdlSampleIsOpen = close};
  //Filter by genre
  filterGenre(genre: any) {
    if(genre == "All"){this.getVideoGames()}else{
      this.videoGamesSvc.getVideoGameGenre(genre).subscribe(
        data => {console.log("success!", data);
        this.listVideoGames = data;
      },error => {
        //alert if the searching was not sucessful
        Swal.fire({position: 'center',
          icon: 'error',
          title: 'Sorry! please contact IT team',
          showConfirmButton: false,
          timer: 2000})})}
  }
}
      
      