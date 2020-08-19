import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameOptions } from '../options/game-options';
import { Time } from '../time/time.model';
import { GameScore } from './game-score';
import { SessionScore, defaultSessionScore } from './session-score';
import { LocalStorageService } from '../storage/local-storage.service';
import { Game } from './game';
import { DialInterval } from '../options/dial-interval.enum';

const SCORES_STORAGE_KEY = 'clocks.scores';

/**
 * Service to calculate game and session scores.
 */
@Injectable({
    providedIn: 'root'
})
export class ScoringService {
    private gameScoresSubject = new BehaviorSubject<GameScore[]>([]);
    private sessionScoreSubject = new BehaviorSubject<SessionScore>(undefined);

    /**
     * Creates an instance of ScoringService.
     */
    constructor(private localStorageService: LocalStorageService) {}

    /**
     * Gets a stream that emits when the scores for an individual game are updated.
     */
    public readonly gameScores$ = this.gameScoresSubject.asObservable();

    /**
     * Gets a stream that emits when the scores for the session are updated.
     */
    public readonly sessionScore$ = this.sessionScoreSubject.asObservable();

    /**
     * Loads total session scores from local storage.
     *
     */
    public load(): void {
        const sessionScore = this.getSessionScore();

        this.sessionScoreSubject.next(sessionScore);
    }

    /**
     * Calculates scores for both the specified game and the session.
     *
     * @param game Details of game to score.
     */
    public score(game: Game): void {
        const gameScores = this.calculateGameScores(game);
        const currentSessionScore = this.getSessionScore();
        const updatedSessionScore = this.calculateSessionScore(currentSessionScore, gameScores);

        this.save(updatedSessionScore);

        this.gameScoresSubject.next(gameScores);
        this.sessionScoreSubject.next(updatedSessionScore);
    }

    /**
     * Resets the game scores and emits "undefined".
     */
    public clearGameScores(): void {
        this.gameScoresSubject.next(undefined);
    }

    private getSessionScore(): SessionScore {
        const sessionScore = this.localStorageService.getObject(SCORES_STORAGE_KEY, defaultSessionScore);

        return sessionScore;
    }

    private save(sessionScore: SessionScore): void {
        this.localStorageService.setObject(SCORES_STORAGE_KEY, sessionScore);
    }

    private calculateGameScores(game: Game): GameScore[] {
        const gameScores: GameScore[] = [];

        for (let index = 0; index < game.times.length; index++) {
            const gameScore = this.calculateGameScore(
                game.times[index],
                game.guesses[index],
                game.commitToMemoryTimeLeft,
                game.recallTimeLeft,
                game.gameOptions
            );

            gameScores.push(gameScore);
        }

        return gameScores;
    }

    private calculateGameScore(
        time: Time,
        guess: Time,
        commitToMemoryTimeLeft: number,
        recallTimeLeft: number,
        gameOptions: GameOptions
    ): GameScore {
        // Make sure correct and partially correct are mutually exclusive
        const isCorrect = this.isCorrect(time, guess, gameOptions);
        const isPartiallyCorrect = !isCorrect && this.isPartiallyCorrect(time, guess, gameOptions);

        const numberDigitCount = gameOptions.numberOfClocks * (gameOptions.dialOptions.showSecondHand ? 6 : 4);
        const totalTimeAllocated = gameOptions.secondsToDisplay + gameOptions.secondsToRespond;
        const totalTimeLeft = commitToMemoryTimeLeft + recallTimeLeft;
        const totalTimeTaken = totalTimeAllocated - totalTimeLeft;

        // Its harder to remember an 8 digit number than it is to remember a 4 digit number twice, so
        // the score exponentially reflects this ...
        const baseScore = Math.pow(numberDigitCount, 1.5) * 4;

        // ... same for the time required to memorize and recall
        const expectedTime = Math.pow(numberDigitCount, 1.51);
        const bonusTimeLeft = (1 - Math.min(totalTimeTaken / expectedTime, 1)) * baseScore;

        // A small bonus for 24 hour times
        const bonusAmPm = gameOptions.dialOptions.isTwentyFourHour ? 5 * gameOptions.numberOfClocks : 0;

        // The fewer markers, the harder it is to get the exact time so proportion based on frequencies of intervals
        let bonusIntervalMarkers = 0;

        switch (gameOptions.dialOptions.dialInterval) {
            case DialInterval.none:
                bonusIntervalMarkers = baseScore * 0.5;
                break;

            case DialInterval.quarterHour:
                bonusIntervalMarkers = baseScore * 0.3;
                break;

            case DialInterval.fiveMinute:
                bonusIntervalMarkers = baseScore * 0.2;
                break;
        }

        // Full score if correct, half score if partially correct
        const correctScore = baseScore + bonusAmPm + bonusIntervalMarkers + bonusTimeLeft;
        const score = Math.floor(isCorrect ? correctScore : isPartiallyCorrect ? correctScore * 0.5 : 0);

        const gameScore: GameScore = {
            gameOptions,
            time,
            guess,
            isCorrect,
            isPartiallyCorrect,
            score
        };

        return gameScore;
    }

    private calculateSessionScore(currentSessionScore: SessionScore, gameScores: GameScore[]): SessionScore {
        const totalScore = gameScores.map(score => score.score).reduce((previous, current) => previous + current);
        const correctCount = gameScores.filter(score => score.isCorrect).length;
        const partiallyCorrectCount = gameScores.filter(score => score.isPartiallyCorrect).length;
        const incorrectCount = gameScores.filter(score => !score.isCorrect && !score.isPartiallyCorrect).length;

        const sessionScore: SessionScore = {
            gamesPlayed: currentSessionScore.gamesPlayed + 1,
            timesDisplayed: currentSessionScore.timesDisplayed + gameScores.length,
            totalScore: currentSessionScore.totalScore + totalScore,
            correctCount: currentSessionScore.correctCount + correctCount,
            partiallyCorrectCount: currentSessionScore.partiallyCorrectCount + partiallyCorrectCount,
            incorrectCount: currentSessionScore.incorrectCount + incorrectCount
        };

        return sessionScore;
    }

    private isCorrect(time: Time, guess: Time, gameOptions: GameOptions): boolean {
        const isCorrect = gameOptions.dialOptions.isTwentyFourHour ? time.isEqualTo(guess) : time.isEquivalentTo(guess);

        return isCorrect;
    }

    private isPartiallyCorrect(time: Time, guess: Time, gameOptions: GameOptions): boolean {
        const isPartiallyCorrect = gameOptions.dialOptions.isTwentyFourHour
            ? time.isEqualTo(guess, true)
            : time.isEquivalentTo(guess, true);

        return isPartiallyCorrect;
    }
}
