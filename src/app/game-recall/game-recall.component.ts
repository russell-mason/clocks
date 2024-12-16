import {
    Component,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    ViewChild,
    HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, first, filter } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { Time } from 'app/shared/time';
import { GameService } from 'app/shared/game';
import { GameOptions } from 'app/shared/options';

import {
    NumberPadComponent,
    HeaderBlockComponent,
    CardComponent,
    ClockFaceComponent,
    FooterBlockComponent,
    SvgImageButtonComponent,
    InitialFocusDirective
} from 'app/shared';

interface GuessesForm {
    guesses: FormArray<FormControl<string>>;
}

/**
 * Component allowing the user to enter their guesses.
 */
@Component({
    selector: 'app-game-recall',
    templateUrl: './game-recall.component.html',
    styleUrls: ['./game-recall.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HeaderBlockComponent,
        CardComponent,
        ClockFaceComponent,
        NumberPadComponent,
        FooterBlockComponent,
        SvgImageButtonComponent,
        InitialFocusDirective
    ]
})
export class GameRecallComponent implements OnInit, OnDestroy {
    private subscriptions: SubSink = new SubSink();

    private guessSubject = new BehaviorSubject<{ index: number; value: string }>(undefined);
    private guess$ = this.guessSubject.asObservable();

    private times$: Observable<Time[]> = this.gameService.times$;

    /**
     * Creates an instance of GameRecallComponent.
     */
    constructor(private gameService: GameService) {
        this.form = this.createForm();
    }

    /**
     * Type alias for template binding.
     */
    public Time = Time;

    /**
     * Gets the number pad component for synchronization.
     */
    @ViewChild(NumberPadComponent)
    public numberPad: NumberPadComponent;

    @ViewChild(InitialFocusDirective)
    public initialFocus: InitialFocusDirective;

    /**
     * Occurs when the "next" button is clicked.
     */
    @Output()
    public readonly next = new EventEmitter();

    /**
     * Gets a stream that emits when game options change.
     */
    public readonly gameOptions$ = this.gameService.currentGameOptions$;

    /**
     * Gets a stream that emits when the recall countdown changes.
     */
    public readonly countdown$ = this.gameService.recallCountdown$;

    /**
     * Gets the form containing user input.
     */
    public readonly form: FormGroup<GuessesForm>;

    /**
     * Gets or sets the index of the currently selected card displaying the clock to be set.
     */
    public selectedIndex = 0;

    /**
     * Sets up coordination between the form and services.
     */
    public ngOnInit(): void {
        // Stream that emits once to get the generated times used in the game
        const timesChange$ = this.times$.pipe(
            first(),
            tap(times => {
                const guessesControls = this.createGuessesFormControls(times.length);

                guessesControls.forEach(guessesControl => this.form.controls.guesses.push(guessesControl));
            })
        );

        // Stream that emits when the form changes so the service can be synchronized
        const guessesChange$ = this.form.valueChanges.pipe(
            tap(value => {
                this.gameService.updateGuesses(value.guesses);
            })
        );

        // Stream that emits when a guess changes so the form control can be updated to a formatted version of the time
        const guessChange$ = this.guess$.pipe(
            filter(value => !!value),
            tap(({ index, value }) => {
                this.form.controls.guesses.controls[index].setValue(value);
            })
        );

        this.subscriptions.add(timesChange$.subscribe(), guessesChange$.subscribe(), guessChange$.subscribe());
    }

    /**
     * Clean up reactive subscriptions.
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * Gets the guess at the index within the form array.
     * Stored as a raw string, e.g. 101525, is then converted to a time, e.g. 10:15:25.
     *
     * @param index The index of the guess to get.
     * @returns The guess represented as a Time.
     */
    public getGuessTime(index: number): Time {
        const value = this.getGuess(index);

        return Time.parse(value);
    }

    /**
     * Gets the guess at the index within the form array. Stored as a raw string, e.g. 101525.
     *
     * @param index The index of the guess to get.
     * @returns The guess represented as a raw string.
     */
    public getGuess(index: number): string {
        return this.form.controls.guesses.controls[index].value;
    }

    /**
     * Gets the guess at the index within the form array, formatted use the specified options.
     * Stored as a raw string, e.g. 1015 or 101525, is formatted as a string, e.g. 10:15, or 10:15:25, depending
     * on whether the option includes seconds.
     *
     * @param index The index of the guess to get.
     * @param gameOptions Option that determine the formatting.
     * @returns The guess represented as a formatted string.
     */
    public getFormattedGuess(index: number, gameOptions: GameOptions): string {
        const value = this.getGuess(index);
        const includeSeconds = gameOptions.dialOptions.showSecondHand;

        return Time.parse(value)?.toString(includeSeconds) ?? value;
    }

    /**
     * Raises the "next" event.
     */
    public onNext(): void {
        this.next.emit();
    }

    /**
     * Intercept ctrl keys 1-4 and selects the card with the corresponding tab index.
     *
     * @param index The index of the card to select.
     */
    @HostListener('document:keyup.control.1', ['0'])
    @HostListener('document:keyup.control.2', ['1'])
    @HostListener('document:keyup.control.3', ['2'])
    @HostListener('document:keyup.control.4', ['3'])
    public onKeySelectedIndexChange(index: number) {
        this.onSelectedIndexChange(index);
    }

    /**
     * Coordinates switching between clocks and ensures the number pad reflects, and updates, the currently one.
     * Automatically resets focus back to the number pad.
     *
     * @param index The index of the pad being used.
     * There may be multiple number pads on screen at the same time so this distinguishes between them.
     */
    public onSelectedIndexChange(index: number) {
        this.selectedIndex = index;

        this.numberPad.setValue(this.form.controls.guesses.controls[index].value);

        // Automatically reset focus back to the number pad
        this.initialFocus.reset();
    }

    /**
     * Coordinates user input and the underlying form containing guesses for the game.
     *
     * @param index The index of the pad being used.
     * There may be multiple number pads on screen at the same time so this distinguishes between them.
     *
     * @param value The value entered on the pad.
     * An attempt is made to convert this to a Time for display.
     */
    public onNumberPadChange(value: string): void {
        this.guessSubject.next({ index: this.selectedIndex, value });
    }

    private createForm(): FormGroup<GuessesForm> {
        return new FormGroup<GuessesForm>({
            guesses: new FormArray<FormControl<string>>([])
        });
    }

    private createGuessesFormControls(count: number): FormControl<string>[] {
        const controlArray: FormControl<string>[] = [];

        for (let index = 0; index < count; index++) {
            controlArray.push(new FormControl(''));
        }

        return controlArray;
    }
}
