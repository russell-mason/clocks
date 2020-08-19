import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SessionScore } from '../shared/game/session-score';

/**
 * Component that represents the score for all games played over time.
 */
@Component({
    selector: 'app-session-score-card',
    templateUrl: './session-score-card.component.html',
    styleUrls: ['./session-score-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionScoreCardComponent {
    /**
     * Gets or sets the accumulative scores from all games.
     */
    @Input()
    public score: SessionScore;
}
