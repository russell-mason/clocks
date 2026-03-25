import { Component, ChangeDetectionStrategy, inject, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    InitialFocusDirective,
    EnterClickDirective
} from 'app/shared';

/**
 * Component allowing the user to enter their guesses.
 */
@Component({
    selector: 'app-game-recall',
    templateUrl: './game-recall.component.html',
    styleUrls: ['./game-recall.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { '(document:keyup)': 'onDocumentKeyupForCardSelect($event)' },
    imports: [
        CommonModule,
        HeaderBlockComponent,
        CardComponent,
        ClockFaceComponent,
        NumberPadComponent,
        FooterBlockComponent,
        SvgImageButtonComponent,
        InitialFocusDirective,
        EnterClickDirective
    ]
})
export class GameRecallComponent {
    private gameService = inject(GameService);

    private readonly numberPad = viewChild(NumberPadComponent);
    private readonly initialFocus = viewChild(InitialFocusDirective);

    constructor() {
        this.guesses.set(Array.from({ length: this.gameService.times().length }, () => ''));
    }

    /**
     * User guesses for each time as a raw string, e.g. 101525, stored in the same order as generated times.
     */
    public readonly guesses = signal<string[]>([]);

    /**
     * Type alias for template binding.
     */
    public Time = Time;

    /**
     * Occurs when the "next" button is clicked.
     */
    public readonly next = output();

    /**
     * Gets a signal that emits when game options change.
     */
    public readonly gameOptions = this.gameService.currentGameOptions;

    /**
     * Gets a signal that emits when the recall countdown changes.
     */
    public readonly countdown = this.gameService.recallCountdown;

    /**
     * Gets or sets the index of the currently selected card displaying the clock to be set.
     */
    public selectedIndex = 0;

    /**
     * Gets the guess at the specified index.
     * Stored as a raw string, e.g. 101525, and then converted to a time, e.g. 10:15:25.
     *
     * @param index The index of the guess to get.
     * @returns The guess represented as a Time.
     */
    public getGuessTime(index: number): Time {
        const value = this.getGuess(index);

        return Time.parse(value);
    }

    /**
     * Gets the guess at the specified index. Stored as a raw string, e.g. 101525.
     *
     * @param index The index of the guess to get.
     * @returns The guess represented as a raw string.
     */
    public getGuess(index: number): string {
        return this.guesses()[index] ?? '';
    }

    /**
     * Gets the guess at the specified index, formatted using the specified options.
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
     * Coordinates switching between clocks and ensures the number pad reflects, and updates, the currently one.
     * Automatically resets focus back to the number pad.
     *
     * @param index The index of the pad being used.
     * There may be multiple number pads on screen at the same time so this distinguishes between them.
     */
    public onSelectedIndexChange(index: number) {
        this.selectedIndex = index;

        this.numberPad().setValue(this.guesses()[index] ?? '');

        // Automatically reset focus back to the number pad
        this.initialFocus().reset();
    }

    /**
     * Coordinates user input and the underlying guesses for the game.
     *
     * @param value The value entered on the pad.
     * An attempt is made to convert this to a Time for display.
     */
    public onNumberPadChange(value: string): void {
        this.guesses.update(guesses =>
            guesses.map((current, index) => (index === this.selectedIndex ? value : current))
        );

        this.gameService.updateGuesses(this.guesses());
    }

    protected onDocumentKeyupForCardSelect(event: KeyboardEvent): void {
        // To ensure consistency between Windows and Mac, uses Alt/Option + top-row 1–4 to select cards
        // document:keyup.alt.1 host binding don't work on Mac, so handled directly from base event

        if (!event.altKey) return;

        const index = GameRecallComponent.altDigitToIndex[event.code];
        const count = this.guesses().length;

        if (index === undefined || index >= count) return;

        event.preventDefault();

        this.onSelectedIndexChange(index);
    }

    private static readonly altDigitToIndex: Record<string, number> = {
        Digit1: 0,
        Digit2: 1,
        Digit3: 2,
        Digit4: 3
    };
}
