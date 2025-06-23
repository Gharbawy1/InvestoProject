import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth/auth.service';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  @Input() companyName: string = 'Investment Platform';
  @Input() companyDescription: string =
    'A comprehensive platform connecting investors with business owners.';
  @Input() contactEmail: string = 'contact@investmentplatform.com';
  @Input() contactPhone: string = '+1 (555) 123-4567';
  @Input() contactAddress: string =
    '123 Investment Street, Financial District, New York, NY 10004';
  @Input() socialLinks: any = {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
  };
  @Input() isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  @Input() navigationLinks: any[] = [
    {
      title: 'Platform',
      links: [
        { label: 'How it works', href: '/how-it-works' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Success stories', href: '/success-stories' },
      ],
    },
    {
      title: 'For Investors',
      links: [
        { label: 'Browse projects', href: '/projects' },
        { label: 'Investment guide', href: '/investment-guide' },
        { label: 'Due diligence', href: '/due-diligence' },
        { label: 'Risk assessment', href: '/risk-assessment' },
      ],
    },
  ];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  }
}
