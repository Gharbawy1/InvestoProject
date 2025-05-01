import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'input-component',
  standalone: true,
  imports: [CommonModule],
  template: `<input
    [type]="type"
    [placeholder]="placeholder"
    [disabled]="disabled"
  />`,
  styleUrl: './input.component.css',
})
export class InputComponent {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;

  @HostBinding('class') get classes(): string {
    return 'flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50';
  }
}
