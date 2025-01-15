import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { HeaderBlockComponent, FooterBlockComponent, SvgImageButtonComponent } from 'app/shared';

/**
 * Component that represents a pause allowing the user to start the game when they're ready.
 */
@Component({
    selector: 'app-game-pending',
    templateUrl: './game-pending.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderBlockComponent, FooterBlockComponent, SvgImageButtonComponent]
})
export class GamePendingComponent {
    /**
     * Occurs when the "next" button is clicked.
     */
    public readonly next = output();

    /**
     * Raises the "next" event.
     */
    public onNext() {
        this.next.emit();
    }
}
