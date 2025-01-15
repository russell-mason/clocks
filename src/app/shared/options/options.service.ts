import { Injectable, inject, signal } from '@angular/core';
import { GameOptions, defaultGameOptions } from './game-options';
import { LocalStorageService } from 'app/shared/storage';

const OPTIONS_STORAGE_KEY = 'clocks.options';

/**
 * Service for persistence of game options.
 */
@Injectable({
    providedIn: 'root'
})
export class OptionsService {
    private localStorageService = inject(LocalStorageService);

    private gameOptionsSignal = signal<GameOptions>(defaultGameOptions);

    /**
     * Gets game options.
     */
    public readonly gameOptions = this.gameOptionsSignal.asReadonly();

    /**
     * Loads game options from local storage.
     * You can get the latest options from gameOptions.
     *
     * @see gameOptions$
     */
    public load(): void {
        const gameOptions = this.localStorageService.getObject(OPTIONS_STORAGE_KEY, defaultGameOptions);

        this.gameOptionsSignal.set(gameOptions);
    }

    /**
     * Saves the specified options to local storage.
     *
     * @param gameOptions The options to save.
     */
    public save(gameOptions: GameOptions): void {
        this.localStorageService.setObject(OPTIONS_STORAGE_KEY, gameOptions);

        this.gameOptionsSignal.set(gameOptions);
    }
}
