import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../project/services/category/category.service';
import { ICategory } from '../../../project/interfaces/icategory';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {}
