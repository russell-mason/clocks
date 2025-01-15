import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService, ScoringService } from 'app/shared/game';
import { CardComponent, HeaderBlockComponent, FooterBlockComponent, SvgImageButtonComponent } from 'app/shared';
import { SessionScoreCardComponent } from 'app/session-score-card/session-score-card.component';
import { GameScoreCardComponent } from 'app/game-score-card/game-score-card.component';

/**
 * Component that displays scores for the game just played and total scores accumulated over time.
 */
@Component({
    selector: 'app-scores',
    templateUrl: './scores.component.html',
    styleUrls: ['./scores.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        HeaderBlockComponent,
        CardComponent,
        SessionScoreCardComponent,
        GameScoreCardComponent,
        FooterBlockComponent,
        SvgImageButtonComponent
    ]
})
export class ScoresComponent {
    private gameService = inject(GameService);
    private scoringService = inject(ScoringService);

    /**
     * Creates an instance of ScoresComponent.
     */
    constructor() {
        this.scoringService.load();
    }

    /**
     * Gets or sets whether to display a message that indicates the game ended due to time running out.
     */
    @Input()
    public showTimeoutMessage: boolean;

    /**
     * Gets a stream that emits scores for the current game.
     */
    public readonly gameScores$ = this.scoringService.gameScores$;

    /**
     * Gets a stream that emits accumulative scores across all games played.
     */
    public readonly sessionScore$ = this.scoringService.sessionScore$;

    /**
     * Resets the game and puts the state back into the pending state.
     */
    public playAgain(): void {
        this.gameService.reset();
    }
}
