import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '../shared/game/game.service';

/**
 * Component that represents a set of times that the user needs to remember.
 * An automatic countdown navigates to the next screen when the time runs out.
 * The user can continue prior to the countdown completing to gain a higher score.
 */
@Component({
    selector: 'app-game-memorize',
    templateUrl: './game-memorize.component.html',
    styleUrls: ['./game-memorize.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameMemorizeComponent {
    /**
     * Creates an instance of GameMemorizeComponent.
     */
    constructor(private gameService: GameService) {}

    /**
     * Occurs when the "next" button is clicked.
     */
    @Output()
    public readonly next = new EventEmitter<any>();

    /**
     * Gets a stream emitting the currently selected game options.
     */
    public readonly gameOptions$ = this.gameService.currentGameOptions$;

    /**
     * Gets a stream emitting the times that need to be remembered.
     */
    public readonly times$ = this.gameService.times$;

    /**
     * Gets a stream emitting a countdown.
     * This is for display only as the flow of the game is handled in the game service.
     */
    public readonly countdown$ = this.gameService.commitToMemoryCountdown$;

    /**
     * Raises the "next" event.
     */
    public onNext(): void {
        this.next.emit();
    }
}
