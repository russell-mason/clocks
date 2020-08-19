import { Directive, HostListener, ElementRef } from '@angular/core';

/**
 * Intercepts keyboard input to allow the enter key to act as a click.
 * This is intended for use only on a single element within the entire view at any given time.
 *
 * @example
 * <div appEnterClick></div>
 */
@Directive({
    selector: '[appEnterClick]'
})
export class EnterClickDirective {
    /**
     * Creates an instance of EnterClickDirective.
     */
    constructor(private element: ElementRef) {}

    /**
     * Listens to the enter key on the document and translates it into a click event on the associated element.
     */
    @HostListener('document:keyup.enter')
    private handleDocumentKeyup(): void {
        this.element.nativeElement.click();
    }
}
