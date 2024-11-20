import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router){
    this.loginForm = this.fb.group({
      username: [null],
      psw: ['', Validators.required]
    })
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }
  
    const username = this.loginForm.get('username')?.value;
    const psw = this.loginForm.get('psw')?.value;
  
    this.authService.login(username, psw).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
  
        if (error.status === 401) {
          alert('Credenciales incorrectas. Intenta nuevamente.');
        } else if (error.status === 400) {
          alert('Solicitud incorrecta. Por favor, verifica los datos ingresados.');
        } else {
          alert('Ocurrió un error inesperado. Intenta más tarde.');
        }
      },
    });
  }
}


