import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProjectMasterComponent } from '../../features/project/components/project-master/project-master.component';

@Component({
  selector: 'app-landing-page',
  imports: [ProjectMasterComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  providers: [],
})
export class LandingPageComponent {
  @Input() title: string = 'Connect with Investment Opportunities That Matter';
  @Input() subtitle: string =
    'Join our platform to discover curated investment projects or showcase your business to potential investors worldwide.';
  @Input() backgroundImage: string =
    'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
  
  @Output() onInvestorSignup = new EventEmitter<void>();
  @Output() onBusinessSignup = new EventEmitter<void>();
  
}
