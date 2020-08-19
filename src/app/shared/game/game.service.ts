import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Subscription } from 'rxjs';
import { tap, first, takeWhile } from 'rxjs/operators';
import { GameStage } from './game-stage.enum';
import { Time } from '../time/time.model';
import { OptionsService } from '../options/options.service';
import { GameOptions, defaultGameOptions } from '../options/game-options';
import { ScoringService } from './scoring.service';
import { Game } from './game';

/**
 * Service that coordinates the flow of a game, generating times, handling timeouts, and progressing through each stage.
 */
@Injectable({
    providedIn: 'root'
})
export class GameService {
    private currentGameStageSubject = new BehaviorSubject<GameStage>(GameStage.pending);
    private currentGameOptionsSubject = new BehaviorSubject<GameOptions>(defaultGameOptions);
    private timesSubject = new BehaviorSubject<Time[]>([]);
    private guessesSubject = new BehaviorSubject<Time[]>([]);
    private commitToMemoryCountdownSubject = new BehaviorSubject<number>(0);
    private commitToMemoryCountdownSubscription: Subscription;
    private recallCountdownSubscription: Subscription;
    private recallCountdownSubject = new BehaviorSubject<number>(0);

    private get currentGameStage() {
        return this.currentGameStageSubject.getValue();
    }

    private get currentGameOptions() {
        return this.currentGameOptionsSubject.getValue();
    }

    private get times() {
        return this.timesSubject.getValue();
    }

    private get guesses() {
        return this.guessesSubject.getValue();
    }

    private get commitToMemoryCountdown() {
        return this.commitToMemoryCountdownSubject.getValue();
    }

    private get recallCountdown() {
        return this.recallCountdownSubject.getValue();
    }

    /**
     * Creates an instance of GameService.
     */
    constructor(private optionsService: OptionsService, private scoringService: ScoringService) {}

    /**
     * Gets a stream that emits as the flow of the game progresses.
     */
    public readonly currentGameStage$ = this.currentGameStageSubject.asObservable();

    /**
     * Gets a stream that emits when the game options change against a new game.
     */
    public readonly currentGameOptions$ = this.currentGameOptionsSubject.asObservable();

    /**
     * Gets a stream that emits when the times used in the game have been created.
     */
    public readonly times$ = this.timesSubject.asObservable();

    /**
     * Gets a stream that emits when the user makes each guess. This is done as the user enters them so that
     * if time runs out, scoring will be based on what they've done so far.
     */
    public readonly guesses$ = this.guessesSubject.asObservable();

    /**
     * Gets a stream that emits every second as time is counted down while the user is memorizing times.
     */
    public readonly commitToMemoryCountdown$ = this.commitToMemoryCountdownSubject.asObservable();

    /**
     * Gets a stream that emits every second as time is counted down while the user is entering their guesses.
     */
    public readonly recallCountdown$ = this.recallCountdownSubject.asObservable();

    /**
     * Resets the game into the pending state.
     * This ensures all current subscriptions are cleaned up and default values are emitted.
     */
    public reset() {
        // Clean up subscriptions that could still be running
        this.commitToMemoryCountdownSubscription?.unsubscribe();
        this.recallCountdownSubscription?.unsubscribe();

        this.optionsService.load();

        this.currentGameStageSubject.next(GameStage.pending);

        // Take a snapshot of the current game options. This is a synchronous operation
        this.optionsService.gameOptions$
            .pipe(
                first(),
                tap(gameOptions => this.currentGameOptionsSubject.next(gameOptions))
            )
            .subscribe();

        // Emit defaults
        this.guessesSubject.next([]);
        this.timesSubject.next(this.createTimes());
        this.commitToMemoryCountdownSubject.next(undefined);
        this.recallCountdownSubject.next(undefined);

        this.scoringService.clearGameScores();
    }

    /**
     * Starts the game and countdown for the user to commit the times to memory.
     * If the countdown hits 0 then this will automatically put the game into the recall stage.
     */
    public startCommitToMemoryCountdown() {
        if (this.currentGameStage !== GameStage.pending) {
            throw new Error('The game must be in the "pending" stage in order to start the countdown.');
        }

        this.currentGameStageSubject.next(GameStage.commitToMemoryCountdown);

        // Start countdown immediately
        this.commitToMemoryCountdownSubscription = timer(0, 1000)
            .pipe(
                tap(seconds =>
                    this.commitToMemoryCountdownSubject.next(this.currentGameOptions.secondsToDisplay - seconds)
                ),
                takeWhile(seconds => seconds < this.currentGameOptions.secondsToDisplay),
                tap({ complete: () => this.timeoutCommitToMemory() })
            )
            .subscribe();
    }

    /**
     * Progresses the game and starts a countdown for the user to recall times from memory.
     * If the countdown hits 0 then this will automatically complete the game and put it into the scoring stage.
     */
    public startRecallCountdown() {
        if (this.currentGameStage !== GameStage.commitToMemoryCountdown) {
            throw new Error('The game must be in the "commit to memory" stage in order to start the countdown.');
        }

        // Clean up subscription that could still be running
        this.commitToMemoryCountdownSubscription.unsubscribe();

        this.currentGameStageSubject.next(GameStage.recallCountdown);

        // Start countdown immediately
        this.recallCountdownSubscription = timer(0, 1000)
            .pipe(
                tap(seconds => this.recallCountdownSubject.next(this.currentGameOptions.secondsToRespond - seconds)),
                takeWhile(seconds => seconds < this.currentGameOptions.secondsToRespond),
                tap({ complete: () => this.timeoutRecall() })
            )
            .subscribe();
    }

    /**
     * Sets the users guesses for the current game.
     * Guesses must be in the same order as the generated times, but if fewer guesses are supplied than the number
     * of generated times then the missing guesses will simply be classes as incorrect.
     * This has no direct side effects so can be set as many times as required prior to the countdown completing.
     * This means that should time run out before the user has finished, the correct guesses will still be scored
     * correctly.
     *
     * @param guesses An array of times guesses by the user.
     * If the value is not in the correct Time format, it will be classes as incorrect.
     */
    public updateGuesses(guesses: string[]) {
        if (this.currentGameStage !== GameStage.recallCountdown) {
            throw new Error('The game must be in the "recall" stage in order to make a guess.');
        }

        const times: Time[] = [];

        for (const guess of guesses) {
            times.push(Time.parse(guess));
        }

        this.guessesSubject.next(times);
    }

    /**
     * Calculates scores for the current game. The current state of play is used even if incomplete.
     */
    public score() {
        if (this.currentGameStage !== GameStage.recallCountdown) {
            throw new Error('The game must be in the "recall" stage in order to score the game.');
        }

        // Clean up subscription that could still be running
        this.recallCountdownSubscription.unsubscribe();

        this.currentGameStageSubject.next(GameStage.complete);

        this.updateScores();
    }

    /**
     * Ends the current stage indicating time has run out while the user was memorizing clock times.
     */
    private timeoutCommitToMemory() {
        this.commitToMemoryCountdownSubscription.unsubscribe();
        this.startRecallCountdown();
        this.currentGameStageSubject.next(GameStage.recallCountdown);
    }

    /**
     * Ends the game indicating time has run out while the user was entering their guesses.
     */
    public timeoutRecall() {
        this.recallCountdownSubscription.unsubscribe();
        this.currentGameStageSubject.next(GameStage.timedOut);

        this.updateScores();
    }

    private createTimes(): Time[] {
        const times: Time[] = [];

        // Create a random time for the same number of clocks selected in the game's options
        for (let index = 0; index < this.currentGameOptions.numberOfClocks; index++) {
            let time = Time.create(this.currentGameOptions.dialOptions.showSecondHand);

            if (!this.currentGameOptions.dialOptions.isTwentyFourHour) {
                time = time.toAm();
            }

            times.push(time);
        }

        return times;
    }

    private updateScores(): void {
        const game: Game = {
            times: this.times,
            guesses: this.guesses,
            gameOptions: this.currentGameOptions,
            commitToMemoryTimeLeft: this.commitToMemoryCountdown,
            recallTimeLeft: this.recallCountdown
        };

        this.scoringService.score(game);
    }
}
