export class Sale{_id?: string;
    name: String;
    email: String;
    state: String;
    city: String;
    address: String;
    zipcode: String;
    cellphone: Number;
    references: String;
    paymenttype: String;
    cardname: String;
    cardnumber: Number;
    cardexpire: String;
    cardcode: Number;
    constructor(
        name: String,
        email: String,
        state: String,
        city: String,
        address: String,
        zipcode: String,
        cellphone: Number,
        references: String,
        paymenttype: String,
        cardname: String,
        cardnumber: Number,
        cardexpire: String,
        cardcode: Number,){
            this.name = name;
            this.email = email;
            this.state = state;
            this.city = city;
            this.address = address;
            this.zipcode = zipcode;
            this.cellphone = cellphone;
            this.references = references;
            this.paymenttype = paymenttype;
            this.cardname = cardname;
            this.cardnumber = cardnumber;
            this.cardexpire = cardexpire;
            this.cardcode = cardcode;}
}