import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Time, Meridiem } from 'app/shared/time';
import { DialOptions, DialInterval } from 'app/shared/options';

/**
 * Component for displaying a clock face with various options such as interval markers around the circumference.
 */
@Component({
    standalone: true,
    selector: 'app-clock-face',
    templateUrl: './clock-face.component.html',
    styleUrls: ['./clock-face.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockFaceComponent {
    /**
     * Gets or sets the time to display on the clock face.
     * If no time is set, the face is displayed with no hands.
     */
    @Input()
    public time: Time;

    /**
     * Gets or sets options which dictate how the clock face is displayed.
     */
    @Input()
    public dialOptions: DialOptions;

    /**
     * Gets whether the second hand should be displayed.
     */
    public get showSeconds(): boolean {
        return this.dialOptions.showSecondHand;
    }

    /**
     * Gets whether quarter-hour interval markers should be displayed.
     */
    public get showQuarterHourIntervals(): boolean {
        return this.dialOptions.dialInterval !== DialInterval.none;
    }

    /**
     * Gets whether five-minute interval markers should be displayed.
     */
    public get showFiveMinuteIntervals(): boolean {
        return (
            this.dialOptions.dialInterval === DialInterval.fiveMinute ||
            this.dialOptions.dialInterval === DialInterval.minute
        );
    }

    /**
     * Gets whether one-minute interval markers should be displayed.
     */
    public get showMinuteIntervals(): boolean {
        return this.dialOptions.dialInterval === DialInterval.minute;
    }

    /**
     * Gets the angle of the hour hand.
     */
    public get hourHandDegrees(): number {
        return 30 * (this.time.hours % 12) + this.time.minutes / 2;
    }

    /**
     * Gets the angle of the minute hand.
     */
    public get minuteHandDegrees(): number {
        return 6 * this.time.minutes;
    }

    /**
     * Gets the angle of the second hand.
     */
    public get secondHandDegrees(): number {
        return 6 * this.time.seconds;
    }

    /**
     * Gets whether the am/pm indicators should be displayed.
     */
    public get showMeridiemIndicator(): boolean {
        return this.dialOptions.isTwentyFourHour;
    }

    /**
     * Gets whether a valid time is available.
     */
    public get hasTime(): boolean {
        return !!this.time;
    }

    /**
     * Gets whether the current time is in the morning.
     */
    public get isAm(): boolean {
        return this.hasTime && this.time.meridiem === Meridiem.ante;
    }

    /**
     * Gets whether the current time is in the afternoon.
     */
    public get isPm(): boolean {
        return this.hasTime && this.time.meridiem === Meridiem.post;
    }
}
