import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario={
    email:'',
    password: ''
  }
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {}
  registrarse() {
    const {email, password} = this.usuario;
    this.authService.register(email,password).then(res => {
      console.log("se registro: ",res);
    })
  }
  logout(){
    this.authService.logout();
  }
  routerlogin(){
    this.router.navigate(['/login'])
  }
}
