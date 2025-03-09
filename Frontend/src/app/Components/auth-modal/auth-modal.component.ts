import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../login-form/login-form.component';
import { RegisterFormComponent } from '../register-form/register-form.component';

@Component({
  selector: 'app-auth-modal',
  imports: [ CommonModule, LoginFormComponent, RegisterFormComponent],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css',
})
export class AuthModalComponent {
  activeTab: 'login' | 'register' = 'login';

  showTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }
}
