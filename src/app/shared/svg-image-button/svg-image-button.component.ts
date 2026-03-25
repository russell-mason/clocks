import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Icon } from './icon';

/**
 * Component that represents a simple button with an SVG image, and an optional caption.
 */
@Component({
    selector: 'app-svg-image-button',
    templateUrl: './svg-image-button.component.html',
    styleUrls: ['./svg-image-button.component.scss'],
    host: { '(click)': 'onHostClick($event)' },
    imports: [RouterModule]
})
export class SvgImageButtonComponent {
    private readonly host = inject(ElementRef<HTMLElement>);
    private readonly rootButton = viewChild.required<ElementRef<HTMLButtonElement>>('rootButton');

    /**
     * Gets or sets the type of icon to display.
     */
    public readonly icon = input.required<Icon>();

    /**
     * Gets or sets the caption to display under the icon.
     * If not specified, no caption is displayed and no space is allocated for it.
     */
    public readonly caption = input<string>();

    /**
     * Gets or set the route to navigate to.
     * If specified and the user clicks the button, they will be navigated to the specified route.
     * If not specified no navigation will occur, and it's up to the consumer of the component to handle the
     * standard "click" event.
     */
    public readonly routerLink = input<string>();

    protected onHostClick(event: MouseEvent): void {
        // Pass the click through to the real button
        if (this.routerLink() !== undefined && event.target === this.host.nativeElement) {
            this.rootButton().nativeElement.click();
        }
    }
}
