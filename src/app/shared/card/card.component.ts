import { Component, ChangeDetectionStrategy, HostBinding, input, effect } from '@angular/core';

/**
 * Component that represents a simple visual container with custom content.
 */
@Component({
    standalone: true,
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
    // For HostBinding synchronization
    private syncIsSelected = effect(() => this.hasSelectedClass = this.isSelected());

    @HostBinding('class.selected')
    private hasSelectedClass = false;

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
