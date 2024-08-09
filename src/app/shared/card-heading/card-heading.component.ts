import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Component that represents a styled heading for use within a card.
 */
@Component({
    standalone: true,
    selector: 'app-card-heading',
    templateUrl: './card-heading.component.html',
    styleUrls: ['./card-heading.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardHeadingComponent {}
