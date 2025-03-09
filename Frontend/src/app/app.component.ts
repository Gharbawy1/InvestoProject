import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/header/header.component';
import { AuthModalComponent } from './Components/auth-modal/auth-modal.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, AuthModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
}
