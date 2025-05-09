import { Component, Input } from '@angular/core';
import { IRecommended } from '../../interfaces/recommended';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/componentes/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recommended',
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './recommended.component.html',
  styleUrl: './recommended.component.css',
})
export class RecommendedComponent {
  @Input() recommends: IRecommended[] = [];
}
