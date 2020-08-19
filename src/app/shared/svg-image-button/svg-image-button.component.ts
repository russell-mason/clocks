import { Component, Input } from '@angular/core';
import { Icon } from './icon';

/**
 * Component that represents a simple button with an SVG image, and an optional caption.
 */
@Component({
    selector: 'app-svg-image-button',
    templateUrl: './svg-image-button.component.html',
    styleUrls: ['./svg-image-button.component.scss']
})
export class SvgImageButtonComponent {
    /**
     * Gets or sets the type of icon to display.
     */
    @Input()
    public icon: Icon;

    /**
     * Gets or sets the caption to display under the icon.
     * If not specified, no caption is displayed and no space is allocated for it.
     */
    @Input()
    public caption: string;

    /**
     * Gets or set the route to navigate to.
     * If specified and the user clicks the button, they will be navigated to the specified route.
     * If not specified no navigation will occur, and it's up to the consumer of the component to handle the
     * standard "click" event.
     */
    @Input()
    public routerLink: string;
}
