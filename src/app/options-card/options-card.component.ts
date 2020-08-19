import { Component, Input } from '@angular/core';

/**
 * Component that represents a visual container with a styled heading and custom content.
 */
@Component({
    selector: 'app-options-card',
    templateUrl: './options-card.component.html',
    styleUrls: ['./options-card.component.scss']
})
export class OptionsCardComponent {
    /**
     * Gets or sets text to display in the heading.
     */
    @Input()
    public heading: string;
}
