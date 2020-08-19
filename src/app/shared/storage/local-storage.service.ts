import { Injectable } from '@angular/core';

/**
 * Service that wraps localStorage to simplify loading and saving objects rather than just strings.
 */
@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    /**
     * Returns the current string value associated with the given key, or null if the given key does not exist.
     *
     * @param key The key to lookup.
     *
     * @returns The associated string if available; otherwise null;
     */
    public getItem(key: string): string {
        return localStorage.getItem(key);
    }

    /**
     * Returns the current object value associated with the given key. If the given key does not exist then the
     * specified default value will be returned instead. The value must have been stored as JSON.
     *
     * @see setObject.
     *
     * @template T The type of the object being retrieved.
     *
     * @param key The key to lookup.
     *
     * @param defaultValue A value to return if the given key does not exist. Defaults to null.
     *
     * @returns The associated object if available; otherwise the specified default value;
     */
    public getObject<T>(key: string, defaultValue: T = null): T {
        const json = this.getItem(key);

        return json ? (JSON.parse(json) as T) : defaultValue;
    }

    /**
     * Sets the string value against the given key, creating a new key/value pair if none already existed.
     *
     * @param key The key to store the value against.
     *
     * @param value The string to store.
     */
    public setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    /**
     * Serializes the object value as JSON and sets it against the given key, creating a new key/value pair
     * if none already existed.
     *
     * @template T The type of the object being stored.
     *
     * @param key The key to store the value against.
     *
     * @param value The object to store.
     */
    public setObject<T>(key: string, value: T): void {
        const json = JSON.stringify(value);

        localStorage.setItem(key, json);
    }
}
