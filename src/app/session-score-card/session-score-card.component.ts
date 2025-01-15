import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { SessionScore } from 'app/shared/game';
import { CardComponent } from 'app/shared';

/**
 * Component that represents the score for all games played over time.
 */
@Component({
    selector: 'app-session-score-card',
    templateUrl: './session-score-card.component.html',
    styleUrls: ['./session-score-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CardComponent]
})
export class SessionScoreCardComponent {
    /**
     * Gets or sets the accumulative scores from all games.
     */
    public readonly score = input.required<SessionScore>();
}
