import { Injectable, inject, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { tap, takeWhile } from 'rxjs/operators';
import { Game } from './game';
import { GameStage } from './game-stage.enum';
import { ScoringService } from './scoring.service';
import { Time } from 'app/shared/time';
import { OptionsService, GameOptions, defaultGameOptions } from 'app/shared/options';

/**
 * Service that coordinates the flow of a game, generating times, handling timeouts, and progressing through each stage.
 */
@Injectable({
    providedIn: 'root'
})
export class GameService {
    private optionsService = inject(OptionsService);
    private scoringService = inject(ScoringService);

    private commitToMemoryCountdownSubscription: Subscription;
    private recallCountdownSubscription: Subscription;

    private readonly currentGameStageSignal = signal<GameStage>(GameStage.pending);
    private readonly currentGameOptionsSignal = signal<GameOptions>(defaultGameOptions);
    private readonly timesSignal = signal<Time[]>([]);
    private readonly guessesSignal = signal<Time[]>([]);
    private readonly commitToMemoryCountdownSignal = signal<number | undefined>(undefined);
    private readonly recallCountdownSignal = signal<number | undefined>(undefined);

    /**
     * Gets a signal that emits as the flow of the game progresses.
     */
    public readonly currentGameStage = this.currentGameStageSignal.asReadonly();

    /**
     * Gets a signal that emits when the game options change against a new game.
     */
    public readonly currentGameOptions = this.currentGameOptionsSignal.asReadonly();

    /**
     * Gets a signal that emits when the times used in the game have been created.
     */
    public readonly times = this.timesSignal.asReadonly();

    /**
     * Gets a signal that emits when the user makes each guess. This is done as the user enters them so that
     * if time runs out, scoring will be based on what they've done so far.
     */
    public readonly guesses = this.guessesSignal.asReadonly();

    /**
     * Gets a signal that emits every second as time is counted down while the user is memorizing times.
     */
    public readonly commitToMemoryCountdown = this.commitToMemoryCountdownSignal.asReadonly();

    /**
     * Gets a signal that emits every second as time is counted down while the user is entering their guesses.
     */
    public readonly recallCountdown = this.recallCountdownSignal.asReadonly();

    /**
     * Resets the game into the pending state.
     * This ensures all current subscriptions are cleaned up and default values are emitted.
     */
    public reset() {
        // Clean up subscriptions that could still be running
        this.commitToMemoryCountdownSubscription?.unsubscribe();
        this.recallCountdownSubscription?.unsubscribe();

        this.optionsService.load();

        this.currentGameStageSignal.set(GameStage.pending);

        // Take a snapshot of the current game options. This is a synchronous operation
        this.currentGameOptionsSignal.set(this.optionsService.gameOptions());

        // Emit defaults
        this.guessesSignal.set([]);
        this.timesSignal.set(this.createTimes());
        this.commitToMemoryCountdownSignal.set(undefined);
        this.recallCountdownSignal.set(undefined);

        this.scoringService.clearGameScores();
    }

    /**
     * Starts the game and countdown for the user to commit the times to memory.
     * If the countdown hits 0 then this will automatically put the game into the recall stage.
     */
    public startCommitToMemoryCountdown() {
        if (this.currentGameStageSignal() !== GameStage.pending) {
            throw new Error('The game must be in the "pending" stage in order to start the countdown.');
        }

        this.currentGameStageSignal.set(GameStage.commitToMemoryCountdown);

        // Start countdown immediately
        this.commitToMemoryCountdownSubscription = timer(0, 1000)
            .pipe(
                tap(seconds =>
                    this.commitToMemoryCountdownSignal.set(this.currentGameOptionsSignal().secondsToDisplay - seconds)
                ),
                takeWhile(seconds => seconds < this.currentGameOptionsSignal().secondsToDisplay),
                tap({ complete: () => this.timeoutCommitToMemory() })
            )
            .subscribe();
    }

    /**
     * Progresses the game and starts a countdown for the user to recall times from memory.
     * If the countdown hits 0 then this will automatically complete the game and put it into the scoring stage.
     */
    public startRecallCountdown() {
        if (this.currentGameStageSignal() !== GameStage.commitToMemoryCountdown) {
            throw new Error('The game must be in the "commit to memory" stage in order to start the countdown.');
        }

        // Clean up subscription that could still be running
        this.commitToMemoryCountdownSubscription.unsubscribe();

        this.currentGameStageSignal.set(GameStage.recallCountdown);

        // Start countdown immediately
        this.recallCountdownSubscription = timer(0, 1000)
            .pipe(
                tap(seconds =>
                    this.recallCountdownSignal.set(this.currentGameOptionsSignal().secondsToRespond - seconds)
                ),
                takeWhile(seconds => seconds < this.currentGameOptionsSignal().secondsToRespond),
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
        if (this.currentGameStageSignal() !== GameStage.recallCountdown) {
            throw new Error('The game must be in the "recall" stage in order to make a guess.');
        }

        const times: Time[] = [];

        for (const guess of guesses) {
            times.push(Time.parse(guess));
        }

        this.guessesSignal.set(times);
    }

    /**
     * Calculates scores for the current game. The current state of play is used even if incomplete.
     */
    public score() {
        if (this.currentGameStageSignal() !== GameStage.recallCountdown) {
            throw new Error('The game must be in the "recall" stage in order to score the game.');
        }

        // Clean up subscription that could still be running
        this.recallCountdownSubscription.unsubscribe();

        this.currentGameStageSignal.set(GameStage.complete);

        this.updateScores();
    }

    /**
     * Ends the current stage indicating time has run out while the user was memorizing clock times.
     */
    private timeoutCommitToMemory() {
        this.commitToMemoryCountdownSubscription.unsubscribe();
        this.startRecallCountdown();
        this.currentGameStageSignal.set(GameStage.recallCountdown);
    }

    /**
     * Ends the game indicating time has run out while the user was entering their guesses.
     */
    public timeoutRecall() {
        this.recallCountdownSubscription.unsubscribe();
        this.currentGameStageSignal.set(GameStage.timedOut);

        this.updateScores();
    }

    private createTimes(): Time[] {
        const times: Time[] = [];
        const options = this.currentGameOptionsSignal();

        // Create a random time for the same number of clocks selected in the game's options
        for (let index = 0; index < options.numberOfClocks; index++) {
            let time = Time.create(options.dialOptions.showSecondHand);

            if (!options.dialOptions.isTwentyFourHour) {
                time = time.toAm();
            }

            times.push(time);
        }

        return times;
    }

    private updateScores(): void {
        const game: Game = {
            times: this.timesSignal(),
            guesses: this.guessesSignal(),
            gameOptions: this.currentGameOptionsSignal(),
            commitToMemoryTimeLeft: this.commitToMemoryCountdownSignal(),
            recallTimeLeft: this.recallCountdownSignal()
        };

        this.scoringService.score(game);
    }
}
