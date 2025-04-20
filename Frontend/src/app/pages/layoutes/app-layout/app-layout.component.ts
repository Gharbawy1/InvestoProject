import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/componentes/header/header.component';
import { FooterComponent } from '../../../shared/componentes/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {

}
