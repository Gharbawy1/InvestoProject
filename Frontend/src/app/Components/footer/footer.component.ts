import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Input() companyName: string = 'Investment Platform';
  @Input() companyDescription: string = 'A comprehensive platform connecting investors with business owners.';
  @Input() contactEmail: string = 'contact@investmentplatform.com';
  @Input() contactPhone: string = '+1 (555) 123-4567';
  @Input() contactAddress: string = '123 Investment Street, Financial District, New York, NY 10004';
  @Input() socialLinks: any = {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
  };
  @Input() navigationLinks: any[] = [
    {
      title: 'Platform',
      links: [
        { label: 'How it works', href: '/how-it-works' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Success stories', href: '/success-stories' }
      ]
    },
    {
      title: 'For Investors',
      links: [
        { label: 'Browse projects', href: '/projects' },
        { label: 'Investment guide', href: '/investment-guide' },
        { label: 'Due diligence', href: '/due-diligence' },
        { label: 'Risk assessment', href: '/risk-assessment' }
      ]
    }
  ];
}
