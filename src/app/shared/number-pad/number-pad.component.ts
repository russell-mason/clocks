import { Component, HostListener, ChangeDetectionStrategy, input, output } from '@angular/core';

/**
 * Component that represents a simple number pad and display.
 * The numbers entered and the display are distinct, the idea being it's up to the consumer of the component
 * to determine what the value represents.
 * For example, the underlying value could be 1234, but be displayed as 1-2-3-4, 123.4, or 12:34, etc.
 */
@Component({
    standalone: true,
    selector: 'app-number-pad',
    templateUrl: './number-pad.component.html',
    styleUrls: ['./number-pad.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberPadComponent {
    private value = '';

    /**
     * Gets or sets the maximum number of digits accepted before the pad becomes disabled.
     */
    public readonly maxLength = input(20);

    /**
     * Gets or sets the value displayed. This is not done automatically.
     * Respond to the "valueChanged" event and set this based on custom logic.
     */
    public readonly displayValue = input.required<string>();

    /**
     * Gets or sets whether the value displayed is seen as acceptable within the context of the component's use.
     * For example, if you expect a four digit number then this should be set to false as the first three numbers are
     * typed.
     * A visual cue is used to distinguish the two states.
     */
    public readonly displayValueAccepted = input.required<boolean>();

    /**
     * Occurs when the value has changed, either from a number typed on the keyboard, clicked via the mouse,
     * or through clear, or delete.
     */
    public readonly valueChanged = output<string>();

    /**
     * Responds to keyboard input.
     * "C" (case insensitive), or the "Escape" key, will clear the current value.
     * The "Backspace" key will delete the last digit entered.
     *
     * @param event The key event to handle.
     */
    @HostListener('keydown', ['$event'])
    public handleKeyup(event: KeyboardEvent): void {
        // Ignore if command keys are down, e.g. Ctrl-2 should not been seen as 2
        if (event.ctrlKey || event.altKey || event.getModifierState('AltGraph')) {
            return;
        }

        if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
            this.clear();
        } else if (event.key === 'Backspace') {
            this.backspace();
        } else if (event.key >= '0' && event.key <= '9') {
            this.onNumberClick(+event.key);
        }
    }

    /**
     * Gets whether additional digits can be entered.
     * When the maximum number of allowed digits have been entered, the control will be disabled.
     */
    public get isEnabled(): boolean {
        return this.value.length < this.maxLength();
    }

    /**
     * Clears the value.
     */
    public clear(): void {
        this.onValueChanged('');
    }

    /**
     * Sets the base value.
     * If the value is undefined or null it will reset to empty.
     *
     * @param value The value to set.
     */
    public setValue(value: string): void {
        value = value ?? ''; // Ensure null/undefined are seen as empty

        this.onValueChanged(value);
    }

    /**
     * Deletes the last digit entered.
     */
    public backspace(): void {
        if (this.value.length > 0) {
            this.onValueChanged(this.value.substr(0, this.value.length - 1));
        }
    }

    /**
     * Handles mouse interaction.
     *
     * @param numberButtonValue The numeric digit clicked.
     */
    public onNumberClick(numberButtonValue: number): void {
        if (this.isEnabled) {
            this.onValueChanged(this.value + numberButtonValue.toString());
        }
    }

    /**
     * Raises the "valueChanged" event passing the specified value.
     *
     * @param value The value to pass in the event.
     */
    public onValueChanged(value: string): void {
        this.value = value;

        this.valueChanged.emit(value);
    }
}
