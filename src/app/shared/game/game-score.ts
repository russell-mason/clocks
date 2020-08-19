import { Time } from '../time/time.model';
import { GameOptions } from '../options/game-options';

/**
 * Represents information about a game in order to score how well the user did.
 */
export interface GameScore {
    /**
     * The options used in the game.
     * More difficult options result in a higher score.
     */
    gameOptions: GameOptions;

    /**
     * The generated time used for comparison.
     */
    time: Time;

    /**
     * The time entered by the user.
     */
    guess: Time;

    /**
     * The calculated score based on game difficulty and user response.
     */
    score: number;

    /**
     * Indicates whether the time and guess match, including seconds (if appropriate).
     */
    isCorrect: boolean;

    /**
     * Indicates whether the time and guess match for hours and minutes, but not seconds.
     */
    isPartiallyCorrect: boolean;
}
