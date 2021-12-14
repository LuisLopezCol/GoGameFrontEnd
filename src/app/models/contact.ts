export class Contact{
    _id?: String;
    name: String;
    email: String;
    idsale: String;
    message: String;

    constructor(
        name: string,
        email: string,
        idsale: String,
        message: String
    ){
        this.name = name;
        this.email = email;
        this.idsale = idsale;
        this.message = message
    }
}