import { Component, Input, HostBinding, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'button-component',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'default';
  @Input() size: 'default' | 'sm' | 'lg' | 'icon' = 'default';

  @HostBinding('class') get classes(): string {
    return [
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
      this.variantClasses(),
      this.sizeClasses(),
    ].join(' ');
  }

  private variantClasses(): string {
    switch (this.variant) {
      case 'destructive':
        return 'bg-red-500 text-white shadow-sm hover:bg-red-600';
      case 'outline':
        return 'border border-gray-300 bg-white shadow-sm hover:bg-gray-100';
      case 'secondary':
        return 'bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300';
      case 'ghost':
        return 'hover:bg-gray-100';
      case 'link':
        return 'text-blue-600 underline-offset-4 hover:underline';
      default:
        return 'bg-slate-900 text-white hover:bg-slate-700 px-4 py-2 rounded';
    }
  }

  private sizeClasses(): string {
    switch (this.size) {
      case 'sm':
        return 'h-8 px-3 text-xs rounded-md';
      case 'lg':
        return 'h-10 px-8 rounded-md';
      case 'icon':
        return 'h-9 w-9 flex items-center justify-center';
      default:
        return 'h-9 px-4 py-2';
    }
  }
}
