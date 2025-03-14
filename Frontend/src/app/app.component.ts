import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/header/header.component';
import { LoginFormComponent } from './Components/login-form/login-form.component';
import { FooterComponent } from './Components/footer/footer.component';
import { ProjectFilterComponent } from './Components/project-filter/project-filter.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, LoginFormComponent, FooterComponent, ProjectFilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
}
