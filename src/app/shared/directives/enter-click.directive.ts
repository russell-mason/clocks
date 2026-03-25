import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Intercepts keyboard input to allow the enter key to act as a click.
 * This is intended for use only on a single element within the entire view at any given time.
 *
 * @example
 * <div appEnterClick></div>
 */
@Directive({
    standalone: true,
    selector: '[appEnterClick]',
    host: { '(document:keyup.enter)': 'handleDocumentKeyup()' }
})
export class EnterClickDirective {
    private element = inject(ElementRef);

    /**
     * Listens to the enter key on the document and translates it into a click event on the associated element.
     */
    public handleDocumentKeyup(): void {
        this.element.nativeElement.click();
    }
}
