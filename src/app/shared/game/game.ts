import { Time } from '../time/time.model';
import { GameOptions } from '../options/game-options';

/**
 * Represents the details of a played game.
 */
export interface Game {
    /**
     * Gets or sets the times generated that the user has to remember.
     */
    times: Time[];

    /**
     * Gets or sets the guesses made by the user.
     */
    guesses: Time[];

    /**
     * Gets or sets options used.
     *
     */
    gameOptions: GameOptions;

    /**
     * Gets or sets the number of seconds remaining after the memorization stage.
     */
    commitToMemoryTimeLeft: number;

    /**
     * Gets or sets the number of seconds remaining after the recall stage.
     */
    recallTimeLeft: number;
}
