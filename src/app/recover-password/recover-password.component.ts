import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { StorageServiceComponent } from '../services/storage.service';
import { SearchServiceComponent } from 'src/app/services/search.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
})
export class RecoverPasswordComponent {
  isButtonDisabled: boolean = false;
  countdown: number = 120;
  userId: string = '';
  resetLink: string = '';

  form: any = {};
  email: string = '';
  message: string = '';
  token: string = '';
  data: any;

  constructor(
    private authService: AuthService,
    private storageService: StorageServiceComponent,
    private _SearchService: SearchServiceComponent
  ) {}

  onSubmit(event: Event) {
    event.preventDefault();
    const emailValue = this.email;

    this.authService.checkEmailExists(emailValue).subscribe(
      (response) => {
        if (response.exists) {
          this.handleUserIdAndSendEmail(emailValue, event);
        } else {
          this.message = 'El email no está registrado en nuestro sistema.';
        }
      },
      (error) => {
        if (error.status === 400 && error.error.exists) {
          this.handleUserIdAndSendEmail(emailValue, event);
        } else {
          this.message =
            'Hubo un error al verificar el email. Por favor, inténtalo de nuevo.';
        }
      }
    );
  }

  handleUserIdAndSendEmail(emailValue: string, event: Event) {
    this.authService.getUserIdByEmail(emailValue).subscribe(
      (data) => {
        this.userId = data.userId;
        this.resetLink = 'http://localhost:8081/resetpassword/' + this.userId;
        this.sendEmail();
      },
      (error) => {
        this.message = 'Hubo un error al obtener el ID del usuario.';
      }
    );
  }

  /*onSubmit(event: Event) {
    event.preventDefault();
    // Accede al valor del correo electrónico desde el modelo o propiedad "email"
    const emailValue = this.email;
    // Validar si el email existe antes de enviar el correo
    this.authService.checkEmailExists(emailValue).subscribe(
      (response) => {
        // Si el email existe, enviar correo
        if (response.exists) {
          this.sendEmail(event);
        } else {
          this.message = 'El email no está registrado en nuestro sistema.';
        }
      },
      (error) => {
        // Verificar si el error es un error 400 y si "exists" es verdadero
        if (error.status === 400 && error.error.exists) {
          this.sendEmail(event);
        } else {
          this.message =
            'Hubo un error al verificar el email. Por favor, inténtalo de nuevo.';
        }
      }
    );
  }*/

  public sendEmail() {
    const emailParams = {
      email: this.email,
      link: this.resetLink,
    };

    emailjs
      .send(
        'service_r14escu',
        'template_eynp9v8',
        emailParams,
        'e1lwbmwrBmOqC36Dp'
      )
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(result.text);
          this.message =
            'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.';
        },
        (error) => {
          console.log(error.text);
          this.message =
            'Hubo un error al intentar enviar el correo electrónico. Por favor, inténtalo de nuevo.';
        }
      );
    this.isButtonDisabled = true;
    const interval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(interval);
        this.isButtonDisabled = false;
        this.countdown = 120;
      }
    }, 1000);
  }
}
