import { Component, ChangeDetectionStrategy, DestroyRef, inject, effect } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameOptions, Theme, DialInterval, OptionsService } from 'app/shared/options';
import { ScoringService } from 'app/shared/game';
import { HeaderBlockComponent, FooterBlockComponent, SvgImageButtonComponent } from 'app/shared';
import { OptionsCardComponent } from 'app/options-card/options-card.component';

interface GameOptionsForm {
    theme: FormControl<Theme>;
    numberOfClocks: FormControl<number>;
    dialOptions: FormGroup<{
        isTwentyFourHour: FormControl<boolean>;
        showSecondHand: FormControl<boolean>;
        dialInterval: FormControl<DialInterval>;
    }>;
    secondsToDisplay: FormControl<number>;
    secondsToRespond: FormControl<number>;
}

/**
 * Component that coordinates the change of options used within the game.
 */
@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        HeaderBlockComponent,
        OptionsCardComponent,
        FooterBlockComponent,
        SvgImageButtonComponent
    ]
})
export class OptionsComponent {
    private destroyRef = inject(DestroyRef);
    private optionsService: OptionsService = inject(OptionsService);
    private scoringService: ScoringService = inject(ScoringService);

    private syncGameOptions = effect(() => this.modelToForm(this.optionsService.gameOptions()));

    /**
     * Creates an instance of OptionsComponent.
     */
    constructor() {
        this.form = this.createForm();

        this.optionsService.load();

        // Coordinates synchronization between user input and the underlying options
        this.form.valueChanges
            .pipe(
                tap(_ => this.formToModel()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
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
     * Indicates whether all scores have been reset.
     */
    public scoresReset = false;

    /**
     * Resets all scores and updates local storage.
     */
    public resetScores(): void {
        this.scoringService.clearSessionScores();
        this.scoresReset = true;
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
