import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  imports: [MatIconModule, FormsModule, RouterLink, NgStyle],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  providers: [],
})
export class LandingPageComponent implements AfterViewInit {
  @Input() title: string = 'Connect with Investment Opportunities That Matter';
  @Input() subtitle: string =
    'Join our platform to discover curated investment projects or showcase your business to potential investors worldwide.';
  @Input() backgroundImage: string =
    'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

  @Output() onInvestorSignup = new EventEmitter<void>();
  @Output() onBusinessSignup = new EventEmitter<void>();

  // Form data
  contactForm = {
    name: '',
    email: '',
    role: '',
    message: '',
  };

  // Mobile menu state
  isMobileMenuOpen = false;

  ngAfterViewInit(): void {
    this.initializeScrollEffects();
    this.initializeIntersectionObserver();
  }

  // Smooth scrolling function
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
    // Close mobile menu if open
    this.isMobileMenuOpen = false;
  }

  // Mobile menu toggle
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Accordion functionality
  toggleAccordion(index: number): void {
    const content = document.getElementById(`content-${index}`);
    const chevron = document.getElementById(`chevron-${index}`);

    // Close all other accordions
    for (let i = 0; i < 5; i++) {
      if (i !== index) {
        const otherContent = document.getElementById(`content-${i}`);
        const otherChevron = document.getElementById(`chevron-${i}`);
        if (otherContent) otherContent.classList.remove('open');
        if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
      }
    }

    // Toggle current accordion
    if (content && chevron) {
      if (content.classList.contains('open')) {
        content.classList.remove('open');
        chevron.style.transform = 'rotate(0deg)';
      } else {
        content.classList.add('open');
        chevron.style.transform = 'rotate(180deg)';
      }
    }
  }

  // Contact form submission
  onSubmitContactForm(): void {
    // Simple form validation
    const { name, email, role, message } = this.contactForm;

    if (!name || !email || !role || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      alert('Please enter a valid email address.');
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      alert("Thank you for your message! We'll get back to you soon.");
      this.resetContactForm();
    }, 1500);
  }

  // Reset contact form
  resetContactForm(): void {
    this.contactForm = {
      name: '',
      email: '',
      role: '',
      message: '',
    };
  }

  // Initialize scroll effects for navigation
  private initializeScrollEffects(): void {
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navigation');
      if (nav) {
        if (window.scrollY > 50) {
          nav.classList.add('shadow-lg');
          nav.classList.remove('bg-white/95');
          nav.classList.add('bg-white');
        } else {
          nav.classList.remove('shadow-lg');
          nav.classList.add('bg-white/95');
          nav.classList.remove('bg-white');
        }
      }
    });
  }

  // Initialize intersection observer for animations
  private initializeIntersectionObserver(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe all animated elements
    document
      .querySelectorAll('.animate-slide-up, .animate-fade-in')
      .forEach((el) => {
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.transform = 'translateY(30px)';
        (el as HTMLElement).style.transition =
          'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
      });
  }

  // Handle investor signup
  handleInvestorSignup(): void {
    this.onInvestorSignup.emit();
  }

  // Handle business signup
  handleBusinessSignup(): void {
    this.onBusinessSignup.emit();
  }
}
