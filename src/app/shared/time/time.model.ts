import { Meridiem } from './meridiem.enum';

/**
 * Represents a time used by game.
 */
export class Time {
    /**
     * Converts a string value into a Time.
     * The value must contain hours, and optionally minutes and seconds.
     * Hours, minutes, and seconds must be represented in two digit form, optionally using a semi-colon separator.
     * If hours or seconds are not supplied then 00 will be assumed.
     *
     * @example
     * 01 will parse to 01:00:00
     * 0102 or 01:02 will parse to 01:02:00
     * 010203 or 01:02:03 will parse to 01:02:03
     *
     * Incomplete values will fail:
     * 1 will parse to undefined
     * 012 will parse to undefined
     * 01:02:3 will parse to undefined
     *
     * @param value The text to parse.
     *
     * @returns The parsed time if valid; otherwise undefined.
     */
    public static parse(value: string): Time {
        if (!value) {
            return undefined;
        }

        const values =
            value.indexOf(':') >= 0 ? value.split(':') : value.split(new RegExp(/(.{2})/)).filter(text => text);

        if (!values || values.length < 1 || values.length > 3) {
            return undefined;
        }

        const hours = Time.toNumber(values[0], 23);
        const minutes = Time.toNumber(values.length >= 2 ? values[1] : '00', 59);
        const seconds = Time.toNumber(values.length === 3 ? values[2] : '00', 59);

        if (hours === undefined || minutes === undefined || seconds === undefined) {
            return undefined;
        }

        const time = new Time(hours, minutes, seconds);

        return time;
    }

    /**
     * Extracts only the Time element from a JavaScript date.
     *
     * @param date The date to get the time from.
     *
     * @returns The newly created Time.
     */
    public static fromDate(date: Date): Time {
        return new Time(date.getHours(), date.getMinutes(), date.getSeconds());
    }

    /**
     * Creates a random Time.
     *
     * @param includeSeconds Specifies whether the generated Time should include seconds, or should default to 00.
     *
     * @returns The newly created Time.
     */
    public static create(includeSeconds: boolean): Time {
        const hours = Math.floor(Math.random() * 23);
        const minutes = Math.floor(Math.random() * 59);
        const seconds = includeSeconds ? Math.floor(Math.random() * 59) : 0;

        return new Time(hours, minutes, seconds);
    }

    private static toNumber(value: string, maxValue: number): number {
        if (value?.trim().length !== 2) {
            return undefined;
        }

        const asNumber = isNaN(+value) || +value > maxValue ? undefined : +value;

        return asNumber;
    }

    /**
     * Creates an instance of Time.
     *
     * @param hours The hours element, from 0 to 23.
     *
     * @param minutes The minutes element, from 0 to 59.
     *
     * @param seconds The seconds element, from 0 to 59.
     */
    constructor(public hours: number, public minutes: number, public seconds: number) {
        if (hours < 0 || hours > 23) {
            throw new Error('Hours must be between 0 and 23.');
        }

        if (minutes < 0 || minutes > 59) {
            throw new Error('Minutes must be between 0 and 59.');
        }

        if (seconds < 0 || seconds > 59) {
            throw new Error('Seconds must be between 0 and 59.');
        }
    }

    /**
     * Gets whether the current time is in the morning or afternoon.
     */
    public get meridiem(): Meridiem {
        return this.hours >= 12 ? Meridiem.post : Meridiem.ante;
    }

    /**
     * Determines if the current Time and the specified Time match.
     * Hours are expected to be exact matches, so 03 (3am) and 15 (3pm) are not equal.
     *
     * @param time The Time to compare with this instance.
     *
     * @param ignoreSeconds Specifies whether seconds should be ignored from the comparison. Defaults to false.
     *
     * @returns True for a match; otherwise false.
     */
    public isEqualTo(time: Time, ignoreSeconds: boolean = false): boolean {
        if (!time) {
            return false;
        }

        const isEqual =
            this.hours === time.hours &&
            this.minutes === time.minutes &&
            (ignoreSeconds || this.seconds === time.seconds);

        return isEqual;
    }

    /**
     * Determines if the current Time and the specified Time are equivalent.
     * Times are equivalent when seen as a 12 hour clock, i.e.
     * 00:15 would naturally be seen as 12:15 am.
     * 15:30 would naturally be seen as 3:30 pm.
     *
     * @param time The Time to compare with this instance.
     *
     * @param ignoreSeconds True to compare hours and minutes only; false to compare hours, minutes, and
     * seconds. Defaults to false.
     *
     * @returns True if equivalent; otherwise false.
     */
    public isEquivalentTo(time: Time, ignoreSeconds: boolean = false): boolean {
        if (!time) {
            return false;
        }

        const hoursAreEquivalent = this.hours === time.hours + 12 || this.hours === time.hours - 12;

        const isEquivalent =
            (this.hours === time.hours || hoursAreEquivalent) &&
            this.minutes === time.minutes &&
            (ignoreSeconds || this.seconds === time.seconds);

        return isEquivalent;
    }

    /**
     * Creates a new Time ensuring the hours represent a time in the morning.
     *
     * @example
     * 18:32:45 returns 06:32:45
     *
     * @returns A new Time with the morning equivalent.
     */
    public toAm(): Time {
        const hours = this.hours > 11 ? this.hours - 12 : this.hours;
        const amTime = new Time(hours, this.minutes, this.seconds);

        return amTime;
    }

    /**
     * Formats the current Time in hours:minutes or hours:minutes:seconds format.
     *
     * @param includeSeconds True for hours:minutes:seconds; false for hours:minutes only. Defaults to true.
     *
     * @returns The formatted time.
     */
    public toString(includeSeconds: boolean = true): string {
        const formattedHours = this.formatNumber(this.hours);
        const formattedMinutes = this.formatNumber(this.minutes);
        const formattedSeconds = includeSeconds ? `:${this.formatNumber(this.seconds)}` : '';
        const formattedTime = `${formattedHours}:${formattedMinutes}${formattedSeconds}`;

        return formattedTime;
    }

    private formatNumber(value: number): string {
        return (value < 10 ? '0' : '') + value.toString();
    }
}
