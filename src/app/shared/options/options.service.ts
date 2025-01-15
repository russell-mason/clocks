import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

    private gameOptionsSubject = new BehaviorSubject<GameOptions>(defaultGameOptions);

    /**
     * Gets a stream that emits when game options change.
     */
    public readonly gameOptions$ = this.gameOptionsSubject.asObservable();

    /**
     * Loads game options from local storage.
     * You can get the latest options from gameOptions$.
     *
     * @see gameOptions$
     */
    public load(): void {
        const gameOptions = this.localStorageService.getObject(OPTIONS_STORAGE_KEY, defaultGameOptions);

        this.gameOptionsSubject.next(gameOptions);
    }

    /**
     * Saves the specified options to local storage.
     *
     * @param gameOptions The options to save.
     */
    public save(gameOptions: GameOptions): void {
        this.localStorageService.setObject(OPTIONS_STORAGE_KEY, gameOptions);

        this.gameOptionsSubject.next(gameOptions);
    }
}
