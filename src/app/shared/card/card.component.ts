import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/**
 * Component that represents a simple visual container with custom content.
 */
@Component({
    standalone: true,
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { '[class.selected]': 'isSelected()' }
})
export class CardComponent {
    /**
     * Gets or sets whether the card is selected. When true a visual cue is displayed.
     */
    public readonly isSelected = input(false);

    /**
     * Gets or sets a card index number.
     * If specified, a small number tab will be shown so that multiple cards can be distinguished from each other.
     * If not specified, no tab is displayed.
     */
    public readonly index = input<number>();
}
