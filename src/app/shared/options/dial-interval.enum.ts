/**
 * Indicates where interval markers appear on the clock's circumference.
 */
export enum DialInterval {
    /**
     * No markers are displayed.
     */
    none,

    /**
     * Markers are displayed only at quarter-hour intervals.
     */
    quarterHour,

    /**
     * Markers are displayed at quarter-hour, and at five-minute intervals.
     */
    fiveMinute,

    /**
     * Markers are displayed at quarter-hour, five-minute, and one-minute intervals.
     */
    minute
}
