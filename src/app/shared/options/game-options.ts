import { DialOptions } from './dial-options';
import { DialInterval } from './dial-interval.enum';
import { Theme } from './theme.enum';

/**
 * Represents options for playing the game.
 */
export interface GameOptions {
    /**
     * Specifies whether to use a light or dark UI.
     */
    theme: Theme;

    /**
     * Specifies how many clocks are displayed.
     */
    numberOfClocks: number;

    /**
     * Determines how the clock face is displayed.
     */
    dialOptions: DialOptions;

    /**
     * Determines how long times are display for while the user commits them to memory.
     */
    secondsToDisplay: number;

    /**
     * Determines how long the user has to recall and enter their guesses.
     */
    secondsToRespond: number;
}

/**
 * Provides default options for initial state.
 */
export const defaultGameOptions: GameOptions = {
    theme: Theme.dark,
    numberOfClocks: 1,
    dialOptions: {
        showSecondHand: false,
        dialInterval: DialInterval.minute,
        isTwentyFourHour: false
    },
    secondsToDisplay: 15,
    secondsToRespond: 15
};
