export class Product{
    _id?: string;
    thumbnail: String;
    title: String;
    short_description: String;
    game_url: String;
    genre: String;
    platform: String;
    publisher: String;
    developer: String; 
    release_date: String;
    freetogame_profile_url: String;
    stock: String;
    price: String;
    constructor(
        thumbnail: String,
        title: String,
        short_description: String,
        game_url: String,
        genre: String,
        platform: String,
        publisher: String,
        developer: String,
        release_date: String,
        freetogame_profile_url: String,
        stock: String,
        price: String,){
            this.thumbnail = thumbnail;
            this.title = title;
            this.short_description = short_description;
            this.game_url = game_url;
            this.genre = genre;
            this.platform = platform;
            this.publisher = publisher;
            this.developer = developer; 
            this.release_date = release_date;
            this.freetogame_profile_url = freetogame_profile_url;
            this.stock = stock;
            this.price = price;}
}