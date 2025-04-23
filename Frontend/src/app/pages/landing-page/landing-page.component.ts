import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { ProjectFilterComponent } from '../../features/project/components/project-filter/project-filter.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-landing-page',
  imports: [ProjectFilterComponent, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  @Input() title: string = "Connect with Investment Opportunities That Matter";
  @Input() subtitle: string = "Join our platform to discover curated investment projects or showcase your business to potential investors worldwide.";
  @Input() backgroundImage: string = "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
  
  @Output() onInvestorSignup = new EventEmitter<void>();
  @Output() onBusinessSignup = new EventEmitter<void>();
  
  features = [
    {
      title: 'Feature 1',
      description: 'Description for feature 1',
      iconPath: 'M12 4.5v15m7.5-7.5h-15',
      iconLinecap: 'round',
      iconLinejoin: 'round'
    },
    {
      title: 'Feature 2',
      description: 'Description for feature 2',
      iconPath: 'M12 4.5v15m7.5-7.5h-15',
      iconLinecap: 'round',
      iconLinejoin: 'round'
    },
    {
      title: 'Feature 3',
      description: 'Description for feature 3',
      iconPath: 'M12 4.5v15m7.5-7.5h-15',
      iconLinecap: 'round',
      iconLinejoin: 'round'
    }
  ];
}

