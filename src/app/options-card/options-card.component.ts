import { Component, Input } from '@angular/core';
import { CardComponent, CardContentComponent, CardHeadingComponent } from 'app/shared';

/**
 * Component that represents a visual container with a styled heading and custom content.
 */
@Component({
    standalone: true,
    selector: 'app-options-card',
    templateUrl: './options-card.component.html',
    styleUrls: ['./options-card.component.scss'],
    imports: [CardComponent, CardHeadingComponent, CardContentComponent]
})
export class OptionsCardComponent {
    /**
     * Gets or sets text to display in the heading.
     */
    @Input()
    public heading: string;
}
