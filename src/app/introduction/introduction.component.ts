import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Component that represents an introduction to the game.
 * Provides a basic overview and detailed help.
 */
@Component({
    selector: 'app-introduction',
    templateUrl: './introduction.component.html',
    styleUrls: ['./introduction.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroductionComponent {}
