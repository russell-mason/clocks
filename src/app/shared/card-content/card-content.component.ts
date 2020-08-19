import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Component that represents styled content for use within a card.
 */
@Component({
    selector: 'app-card-content',
    templateUrl: './card-content.component.html',
    styleUrls: ['./card-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardContentComponent {}
