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

  onSubmit() {
    this.authService.login(this.loginForm.get('username')?.value , this.loginForm.get('psw')?.value).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        alert('Credenciales incorrectas');
      },
    });
  }
}


