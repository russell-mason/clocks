import { Component, OnDestroy, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { OptionsService } from '../shared/options/options.service';
import { GameOptions } from '../shared/options/game-options';
import { Theme } from '../shared/options/theme.enum';
import { DialInterval } from '../shared/options/dial-interval.enum';

/**
 * Component that coordinates the change of options used within the game.
 */
@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsComponent implements OnInit, OnDestroy {
    private subscriptions = new SubSink();

    /**
     * Creates an instance of OptionsComponent.
     */
    constructor(private optionsService: OptionsService) {
        this.form = this.createForm();
    }

    /**
     * Type alias for template binding.
     */
    public readonly Theme = Theme;

    /**
     * Type alias for template binding.
     */
    public readonly DialInterval = DialInterval;

    /**
     * Gets the valid values that can be selected for countdowns.
     */
    public readonly validPeriodsInSeconds = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

    /**
     * Gets the form containing user inputs.
     */
    public readonly form: UntypedFormGroup;

    /**
     * Coordinates synchronization between user input and the underlying options.
     */
    public ngOnInit(): void {
        this.optionsService.load();

        const gameOptionsChange$ = this.optionsService.gameOptions$.pipe(
            tap(gameOptions => this.modelToForm(gameOptions))
        );

        const formChange$ = this.form.valueChanges.pipe(tap(_ => this.formToModel()));

        this.subscriptions.add(gameOptionsChange$.subscribe(), formChange$.subscribe());
    }

    /**
     * Clean up reactive subscriptions.
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private createForm(): UntypedFormGroup {
        return new UntypedFormGroup({
            theme: new UntypedFormControl(),
            numberOfClocks: new UntypedFormControl(),
            dialOptions: new UntypedFormGroup({
                isTwentyFourHour: new UntypedFormControl(),
                showSecondHand: new UntypedFormControl(),
                dialInterval: new UntypedFormControl()
            }),
            secondsToDisplay: new UntypedFormControl(),
            secondsToRespond: new UntypedFormControl()
        });
    }

    private modelToForm(gameOptions: GameOptions): void {
        this.form.patchValue(gameOptions, { emitEvent: false });
    }

    private formToModel(): void {
        if (this.form.valid) {
            this.optionsService.save(this.form.value);
        }
    }
}
