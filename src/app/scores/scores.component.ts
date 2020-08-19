import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '../shared/game/game.service';
import { ScoringService } from '../shared/game/scoring.service';

/**
 * Component that displays scores for the game just played and total scores accumulated over time.
 */
@Component({
    selector: 'app-scores',
    templateUrl: './scores.component.html',
    styleUrls: ['./scores.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoresComponent {
    /**
     * Creates an instance of ScoresComponent.
     */
    constructor(private gameService: GameService, private scoringService: ScoringService) {
        scoringService.load();
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
