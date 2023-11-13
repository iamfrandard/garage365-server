import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  token: string = ''; // Este será el ID del usuario
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.token = params['id'];
    });
  }

  submitForm() {
    if (this.password === this.confirmPassword) {
      // Realizar una solicitud al servidor para verificar el token y obtener los detalles del usuario
      this.http.get(`/api/auth/verifytoken/${this.token}`).subscribe(
        (response: any) => {
          if (response.valid && !response.expired) {
            const userId = response.userId;

            const resetPasswordData = {
              userId: userId,
              password: this.password,
            };

            this.http
              .put('/api/auth/updatepassword', resetPasswordData)
              .subscribe(
                () => {
                  console.log('Contraseña actualizada correctamente');
                  this.router.navigate(['/login']);
                },
                (error) => {
                  console.error('Error al actualizar la contraseña', error);
                }
              );
          } else {
            console.log('Token inválido o expirado');
          }
        },
        (error) => {
          console.error('Error al verificar el token', error);
        }
      );
    } else {
      console.log('Las contraseñas no coinciden');
    }
  }
}

/* submitForm() {
    if (this.password === this.confirmPassword) {
      console.log('HOLA1');
      // Realizar una solicitud al servidor para verificar el token y obtener los detalles del usuario
      this.http.get(`/api/auth/verifytoken/${this.token}`).subscribe(
        (response: any) => {
          console.log('HOLA2');
          // Verificar si el token es válido y no ha expirado
          if (response.valid && !response.expired) {
            const userId = response.userId;
            console.log('HOLA3');
            // Enviar una solicitud para actualizar la contraseña del usuario
            const resetPasswordData = {
              userId: userId,
              password: this.password,
            };

            this.http
              .put('/api/auth/updatepassword', resetPasswordData)
              .subscribe(
                (updateResponse) => {
                  console.log('Contraseña actualizada correctamente');
                  // Redirigir al usuario a la página de inicio de sesión o a otra página de confirmación
                  this.router.navigate(['/login']);
                  console.log('HOLA4');
                },
                (error) => {
                  console.error('Error al actualizar la contraseña', error);
                  // Manejar el error y mostrar un mensaje de error al usuario
                  console.log('HOLA5');
                }
              );
          } else {
            console.log('Token inválido o expirado');
            // Mostrar un mensaje de error al usuario, redirigirlo a otra página, etc.
            console.log('HOLA6');
          }
        },
        (error) => {
          console.error('Error al verificar el token', error);
          // Manejar el error y mostrar un mensaje de error al usuario
          console.log('HOLA7');
        }
      );
    } else {
      console.log('Las contraseñas no coinciden');
      console.log('HOLA8');
    }
  }*/
