import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() isLoggedIn: boolean = true;
  @Input() userName: string = 'John Doe';
  @Input() userImageURL: string = 'https://via.placeholder.com/150';
  @Output() loginClick = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();

  isMenuOpen = false;
  isDropDownOpen = false;
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  toggleDropDown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }
  
}
