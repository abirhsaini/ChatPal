import { Component } from '@angular/core';
import { User } from '../../services/User';
import { CognitoService } from '../../services/cognito.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private router:Router,
    private cognitoService:CognitoService
  ) { }

  user:User={
    user_id: '',
    user_email: '',
    user_name: '',
    username: '',
    user_photoURL: '',
    user_ins: new Date,
    user_password: '',
    code:''
  }
  pathLogo="../assets/images/ChatPal.png";
  homeImage="../assets/images/homeimage.png";

  login() {
   this.cognitoService.signIn(this.user).then(()=>{
    this.router.navigate(["/users"])
   }).catch((error)=>{
    this.displayAlertError(error.message)
   })
  }

  private displayAlertError(message: string) {

    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }
}
