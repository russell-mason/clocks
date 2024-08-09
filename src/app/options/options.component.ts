import { Component, OnDestroy, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { GameOptions, Theme, DialInterval, OptionsService } from 'app/shared/options';
import { HeaderBlockComponent, FooterBlockComponent, SvgImageButtonComponent } from 'app/shared';
import { OptionsCardComponent } from 'app/options-card/options-card.component';

interface GameOptionsForm {
    theme: FormControl<Theme>;
    numberOfClocks: FormControl<number>,
    dialOptions: FormGroup<{
        isTwentyFourHour: FormControl<boolean>,
        showSecondHand: FormControl<boolean>,
        dialInterval: FormControl<DialInterval>
    }>,
    secondsToDisplay: FormControl<number>,
    secondsToRespond: FormControl<number>
};

/**
 * Component that coordinates the change of options used within the game.
 */
@Component({
    standalone: true,
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule, HeaderBlockComponent, OptionsCardComponent, FooterBlockComponent, SvgImageButtonComponent]
})
export class OptionsComponent implements OnInit, OnDestroy {
    private subscriptions = new SubSink();
    private optionsService: OptionsService = inject(OptionsService);

    /**
     * Creates an instance of OptionsComponent.
     */
    constructor() {
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
    public readonly form: FormGroup<GameOptionsForm>;

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

    private createForm(): FormGroup<GameOptionsForm> {
        return new FormGroup<GameOptionsForm>({
            theme: new FormControl(),
            numberOfClocks: new FormControl(),
            dialOptions: new FormGroup({
                isTwentyFourHour: new FormControl(),
                showSecondHand: new FormControl(),
                dialInterval: new FormControl()
            }),
            secondsToDisplay: new FormControl(),
            secondsToRespond: new FormControl()
        });
    }

    private modelToForm(gameOptions: GameOptions): void {
        this.form.patchValue(gameOptions, { emitEvent: false });
    }

    private formToModel(): void {
        if (this.form.valid) {
            this.optionsService.save(this.form.value as GameOptions);
        }
    }
}
