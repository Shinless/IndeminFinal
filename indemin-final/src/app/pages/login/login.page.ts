import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';
import { userLogin } from 'src/app/models/userLogin';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userLogin: userLogin = {
    email: '',
    password: '',
    tipo_usuario: ''
  };

  isLoaded: boolean = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 800);
  }

  async login() {
    try {
      const usuario = await this.supabaseService.login(this.userLogin).toPromise();

      if (usuario && usuario.user) {
        localStorage.setItem('tipo_usuario', usuario.user.tipo_usuario);
        this.handleSuccessfulLogin(usuario.user.tipo_usuario);
      } else {
        this.presentToast("Usuario y/o Contraseña incorrectas");
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      let errorMessage = 'Ocurrió un error en la autenticación. Por favor, inténtelo de nuevo.';
      
      // Transformar el error a string si es necesario
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && error.hasOwnProperty('error')) {
        errorMessage = error.toString();
      }
      
      this.presentToast(errorMessage); // Mostrar mensaje de error recibido desde el servicio
    }
  }

  handleSuccessfulLogin(tipoUsuario: string) {
    console.log('Usuario logueado:', tipoUsuario);
    console.log('Valor de tipo_usuario:', tipoUsuario);

    if (tipoUsuario === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
