import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/Account.service';
import { UpdateProfileDto } from '../../interfaces/UpdateProfile';

@Component({
  selector: 'app-user-info-card',
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.css'],
})
export class UserInfoCardComponent {
  @Input() title!: string;
  @Input() data: Array<{ label: string; value: string }> = [];
  @Output() editClicked = new EventEmitter<void>();
}
