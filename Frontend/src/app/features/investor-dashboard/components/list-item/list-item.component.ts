import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { Iinvestment } from '../../interfaces/iinvestment';
import { ButtonComponent } from "../../../../shared/componentes/button/button.component";
@Component({
  selector: 'list-item',
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css'
})
export class ListItemComponent {
  @Input() projectName : string = '';
  @Input() amount  : number = 0;
  @Input() date   : string = '';
  @Input() status : 'active' | 'Pending' | 'completed' = 'active';
  @Input() progress : number = 0;
  @Input() returnRate : number = 0;
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
    
}
