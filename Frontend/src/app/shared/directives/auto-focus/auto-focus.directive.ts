import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

/**
 * Directive to automatically focus an element when a condition is met.
 * Ensures the element is fully rendered before applying focus.
 */
@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {

  /**
   * Determines whether the element should be focused.
   * Defaults to `true` if not explicitly provided.
   */
  @Input() appAutoFocus: boolean = true;

  /**
   * Constructs the directive and injects the `ElementRef` for DOM access.
   * @param {ElementRef} el - Reference to the host element.
   */
  constructor(private el: ElementRef<HTMLElement>) {}

  /**
   * Lifecycle hook that runs after the component's view has been initialized.
   * Focuses the element if `appAutoFocus` is `true`.
   */
  ngAfterViewInit(): void {
    if (this.appAutoFocus) {
      setTimeout(() => this.el.nativeElement.focus(), 0);
    }
  }
}
