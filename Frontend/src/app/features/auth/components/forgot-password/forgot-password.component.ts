import { Component, EventEmitter, Output, NgModule } from '@angular/core';
import { NgForm, FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { AutoFocusDirective } from '../../../../shared/directives/auto-focus/auto-focus.directive';

@Component({
  selector: 'app-forgot-password',
  imports: [ FormsModule, CommonModule, AutoFocusDirective ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent {
  forgotPasswordEmail: string = '';
  forgotPasswordError: string = '';
  forgotPasswordSuccess: boolean = false;
  isLoading: boolean = false;

  /** Event emitter to close modal */
  @Output() closeModal = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

   // Clear messages when user modifies email
  onEmailChange(): void {
    this.forgotPasswordError = '';
    this.forgotPasswordSuccess = false;
  }

  // Unified error checking
  showEmailError(input: NgModel): boolean {
    return !!input.invalid && !!input.touched; // Remove form.submitted condition
  }  

  // Dynamic error messages
  getErrorMessage(input: NgModel): string {
    if (this.forgotPasswordError) return this.forgotPasswordError;
    if (input.invalid && input.touched) return '* Please enter a valid email';
    return '';
  }  

  sendResetLink(form: NgForm): void {
    // Mark all fields as touched to show validation errors
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });

    // Handle invalid form
    if (form.invalid) {
      this.forgotPasswordError = '* Please enter a valid email';
      return;
    }

    this.isLoading = true;
    this.forgotPasswordError = '';
    this.forgotPasswordSuccess = false;

    /*this.authService.sendResetLink(this.forgotPasswordEmail).subscribe({
      next: () => {
        this.forgotPasswordSuccess = true;
        this.isLoading = false;
        this.forgotPasswordError = ''; // Ensure error clears if successful
        setTimeout(() => this.closeModal.emit(), 3000);
      },
      error: () => {
        this.forgotPasswordError = 'Failed to send reset link. Please try again.';
        this.isLoading = false;
        this.forgotPasswordSuccess = false; // Ensure success message is hidden
      }
    });*/
  }
}
