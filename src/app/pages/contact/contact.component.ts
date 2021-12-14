import { Component, OnInit } from '@angular/core';
import { VideoGamesService } from 'src/app/services/video-games.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Contact } from 'src/app/models/contact';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  
  remainingText = 0
  
  //Reactive Form
  contactForm: FormGroup;  
  numericValue = /^[0-9]+$/;

  constructor(private videoGamesSvc:VideoGamesService, private formBuilder: FormBuilder,) { 
    //Creating group for the validation of the contact form
    this.contactForm = this.formBuilder.group({
      name: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      idsale: [''],
      message: ['',Validators.required],
  })}

  ngOnInit(): void {
  }

  valueChange(value: any) {
    this.remainingText = 2000 - value;
 }

  //-------Data from reactive form and send it to DB-------
  postContact(){
    const CONTACT: Contact = {
      name: this.contactForm.get('name')?.value,
      email: this.contactForm.get('email')?.value,
      idsale: this.contactForm.get('idsale')?.value,
      message: this.contactForm.get('message')?.value,
    }
    let contact: any = {};
    contact = CONTACT;
    this.videoGamesSvc.postContact(contact).subscribe(
    data => { console.log("success!", data);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Thanks, we have received your message',
        showConfirmButton: false,
        timer: 3000
      })
      this.contactForm.reset();
    },
    error => {
      console.error("couldn't post because", error)
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Sorry, there was a mistake, please try again',
        showConfirmButton: false,
        timer: 3000
      })
    });
  }
}
