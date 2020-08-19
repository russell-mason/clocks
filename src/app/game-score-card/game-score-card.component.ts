import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { GameScore } from '../shared/game/game-score';

/**
 * Component that represents the score for a single guess against a time.
 */
@Component({
    selector: 'app-game-score-card',
    templateUrl: './game-score-card.component.html',
    styleUrls: ['./game-score-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameScoreCardComponent {
    /**
     * Gets of sets the card index to distinguish which clock is which when multiple times are displayed.
     */
    @Input()
    public index: number;

    /**
     * Gets or sets the game score for the last completed game.
     */
    @Input()
    public score: GameScore;

    /**
     * Determine how accurate the guess was:
     * Correct, i.e. the time is correct including seconds (if appropriate).
     * Partially correct, i.e. the time is correct but the seconds were incorrect.
     * Incorrect, i.e. the hours and minutes did not match.
     * @param gameScore The game score to determining the accuracy of the guess.
     *
     * @returns "correct", "partially correct", or "incorrect".
     */
    public getAccuracy(gameScore: GameScore): string {
        return gameScore.isCorrect ? 'correct' : gameScore.isPartiallyCorrect ? 'partially correct' : 'incorrect';
    }

    /**
     * Gets a CSS class name for styling a success or failure indicator.
     *
     * @see getAccuracy
     *
     * @param gameScore The game score to determining the accuracy of the guess.
     *
     * @returns "correct", "partially-correct", or "incorrect".
     */
    public getAccuracyClass(gameScore: GameScore): string {
        return this.getAccuracy(gameScore).replace(/ /g, '-');
    }

    /**
     * Gets an icon ID for displaying a success or failure icon.
     *
     * @see getAccuracy
     *
     * @param gameScore The game score to determining the accuracy of the guess.
     *
     * @returns "correct-icon", "partially-correct-icon", or "incorrect-icon".
     */
    public getAccuracyIcon(gameScore: GameScore): string {
        return this.getAccuracyClass(gameScore) + '-icon';
    }
}
