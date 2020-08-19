/**
 * Indicates the current location within the flow of the game.
 */
export enum GameStage {
    /**
     * The game has yet to start.
     * The user has to explicitly start the game to ensure they are ready.
     */
    pending,

    /**
     * Times are being displayed to the user allowing them to memorize them.
     * A countdown is in progress to restrict the amount of time they have to do this.
     */
    commitToMemoryCountdown,

    /**
     * The user is prompted to recall the times previously shown.
     * A countdown is in progress to restrict the amount of time they have to do this.
     */
    recallCountdown,

    /**
     * The game is over but the user did not complete entering their guesses before the time ran out.
     */
    timedOut,

    /**
     * The game is over and the user completed entering their guesses before the time ran out.
     */
    complete
}
