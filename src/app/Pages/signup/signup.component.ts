import { Component } from '@angular/core';
import Swal from 'sweetalert2'
import { User } from '../../services/User';
import { CognitoService } from '../../services/cognito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private cognitoService: CognitoService, private router: Router) { }

  user: User = {
    user_id: '',
    user_email: '',
    user_password: '',
    user_name: '',
    username: '',
    user_photoURL: '',
    code: '',
    user_ins: new Date()
  }
  isConfirm: boolean = false;
  alertMessage: String = '';
  showAlert: boolean = false;

  pathLogo = "../assets/images/ChatPal.png";
  homeImage = "../assets/images/homeimage.png";

  ngOnInit(): void {
    this.user = {} as User;
    this.isConfirm = false;

  }

  public signup() {

    if (this.user && this.user.username && this.user.user_password) {
      this.cognitoService.signup(this.user).then(() => {
        this.isConfirm = true
        this.displaySuccessAlert("Signed un successfully confirm your email")
      }).catch((error: any) => {

        this.displayAlertError(error.message)
      })
    }
    else {
      console.log(this.user);
      this.displayAlertError("Missing user information")
    }

  }

  public confirmSignUp() {
    console.log(this.user?.code)
    if (this.user) {
      const confirmationCode = this.user?.code
      this.cognitoService.confirmSignUp(this.user, confirmationCode).then(() => {
        this.router.navigate(["/login"]);
        this.displaySuccessAlert("confirm pass successfully")
      }).catch((error: any) => {
        console.log(error)
        this.displayAlertError(error.message)
      })
    }
    else {
      this.displayAlertError("Missing user information")
    }
  }
  private displayAlertError(message: string) {

    this.alertMessage = message;
    this.showAlert = true;
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }
  private displaySuccessAlert(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: message
    });
  }
}
