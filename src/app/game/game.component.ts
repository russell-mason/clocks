import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStage, GameService } from 'app/shared/game';
import { GamePendingComponent } from 'app/game-pending/game-pending.component';
import { GameMemorizeComponent } from 'app/game-memorize/game-memorize.component';
import { GameRecallComponent } from 'app/game-recall/game-recall.component';
import { ScoresComponent } from 'app/scores/scores.component';

/**
 * Component that coordinates what's shown to the user at any given time.
 * Responds to changes in the game and selects different components.
 */
@Component({
    standalone: true,
    selector: 'app-game',
    templateUrl: './game.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, GamePendingComponent, GameMemorizeComponent, GameRecallComponent, ScoresComponent]
})
export class GameComponent implements OnInit, OnDestroy {
    /**
     * Creates an instance of GameComponent.
     */
    constructor(private gameService: GameService) {}

    /**
     * Type alias for template binding.
     */
    public readonly GameStage = GameStage;

    /**
     * Gets a stream emitting the current stage of the game.
     * As the game progresses different screens are automatically displayed.
     */
    public readonly currentGameStage$ = this.gameService.currentGameStage$;

    /**
     * Initializes the game so it always starts from a known state.
     */
    public ngOnInit(): void {
        this.gameService.reset();
    }

    /**
     * Clean up reactive subscriptions.
     */
    public ngOnDestroy(): void {
        this.gameService.reset();
    }

    /**
     * Indicates the user is ready to play and times should be displayed for them to memorize.
     */
    public startCommitToMemoryCountdown(): void {
        this.gameService.startCommitToMemoryCountdown();
    }

    /**
     * Indicates the user has finished memorizing the times and is ready to recall them.
     */
    public startRecallCountdown(): void {
        this.gameService.startRecallCountdown();
    }

    /**
     * Indicates the user has finished recalling the times and is ready for them to be scored.
     */
    public score(): void {
        this.gameService.score();
    }
}
