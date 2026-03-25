import { Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Sets focus to the associated element, or child element, as specified by a CSS selector.
 * If the selector does not match an element, then no action is taken.
 * This is mainly intended for use on a parent element that is rendered once, and contains a repeating set of
 * components allowing the focus to be given to the first component in the group.
 * N.B. If the associated component itself is re-rendered, this will reset the focus.
 *
 * @example
 * <div appInitialFocus="input[type='checkbox']">
 *     <input type="text">
 *     <input type="checkbox" *ngFor="let value of values">
 * </div>
 */
@Directive({
    standalone: true,
    selector: '[appInitialFocus]'
})
export class InitialFocusDirective {
    private element = inject(ElementRef);

    constructor() {
        // Sets focus once the full view is available
        afterNextRender(() => this.reset());
    }

    /**
     * Relative CSS selector to the element to set focus to.
     * If not specified, sets focus to the element the directive is associated with.
     */
    public readonly appInitialFocus = input.required<string>();

    /**
     * Resets focus to the associated selector element.
     */
    public reset(): void {
        this.focus(
            this.appInitialFocus()
                ? this.element.nativeElement.querySelector(this.appInitialFocus())
                : this.element.nativeElement
        );
    }

    private focus(targetElement: any): void {
        if (targetElement && targetElement.focus) {
            targetElement.focus();
        }
    }
}
