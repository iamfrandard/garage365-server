import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify-accountU',
  templateUrl: './verify-accountU.component.html',
  styleUrls: ['./verify-accountU.component.css']
})
export class VerifyAccountUComponent implements OnInit {
  currentUser: any;
  id: string | null;

  constructor
  (
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) 
  {
    this.animateProgressBar();
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.authService.verifyAccountU(this.id).subscribe(
      response => {
        if (response.message === "Verificado") {
          // Haz algo si la cuenta ha sido verificada exitosamente
          // Por ejemplo, mostrar un mensaje de éxito o redirigir al usuario
        } else {
          // Maneja otros mensajes, por ejemplo, si la cuenta ya está verificada
        }
      },
      error => {
        // Maneja el error aquí, como mostrar un mensaje al usuario
        console.error("Error:", error);
      }
    );
  }

  animateProgressBar() {
    let value = 0;
    const interval = setInterval(() => {
      value += 1;
      const progressBar: any = document.querySelector('.progress-bar');
      progressBar.style.width = value + "%";
      progressBar.setAttribute('aria-valuenow', value);
      if (value === 100) {
        clearInterval(interval);
        this.router.navigate(['/ingreso']);
      }
    }, 70);
  }

  skipVerification(): void {
    this.router.navigate(['/ingreso']);
  }
}
