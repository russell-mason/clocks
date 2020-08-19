/**
 * Represents total scores over multiple games.
 * Scores are stored in local storage and are accumulative over time.
 */
export interface SessionScore {
    /**
     * Specifies how many games have been played in total.
     */
    gamesPlayed: number;

    /**
     * Specifies how many times have been shown in total. Multiple times may be displayed per game.
     */
    timesDisplayed: number;

    /**
     * Specifies the accumulated scores for all games played.
     */
    totalScore: number;

    /**
     * Specifies the number of correct guesses given across all games played.
     */
    correctCount: number;

    /**
     * Specifies the number of partially correct guesses given across all games played.
     * A partially correct guess is when hours and minutes match, but seconds do not.
     */
    partiallyCorrectCount: number;

    /**
     * Specifies the number of incorrect guesses given across all games played.
     */
    incorrectCount: number;
}

/**
 * Provides default options for initial state.
 */
export const defaultSessionScore: SessionScore = {
    gamesPlayed: 0,
    timesDisplayed: 0,
    totalScore: 0,
    correctCount: 0,
    partiallyCorrectCount: 0,
    incorrectCount: 0
};
