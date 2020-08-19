import { DialInterval } from './dial-interval.enum';

/**
 * Represents how a clock face is displayed.
 */
export interface DialOptions {
    /**
     * Determines if the am/pm indicators are displayed and the user must distinguish between am/pm times.
     * e.g. 03:15 and 15:15 are classed as equal when false; and unequal when true.
     */
    isTwentyFourHour: false;

    /**
     * Determines if the second hand should be displayed.
     */
    showSecondHand: boolean;

    /**
     * Determines where interval markers appear on the clock's circumference.
     */
    dialInterval: DialInterval;
}
