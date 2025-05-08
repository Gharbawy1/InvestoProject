import { Component, Inject, Input } from '@angular/core';
import { Router } from 'express';
import { IOfferProfile } from '../../../project/interfaces/IOfferProfile';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/componentes/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-investments',
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './investments.component.html',
  styleUrl: './investments.component.css',
})
export class InvestmentsComponent {
  @Input() investments: IOfferProfile[] = [];
}
