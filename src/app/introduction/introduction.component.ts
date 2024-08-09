import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderBlockComponent, SvgImageButtonComponent, FooterBlockComponent } from 'app/shared';
import { OptionsCardComponent } from 'app/options-card/options-card.component';

/**
 * Component that represents an introduction to the game.
 * Provides a basic overview and detailed help.
 */
@Component({
    standalone: true,
    selector: 'app-introduction',
    templateUrl: './introduction.component.html',
    styleUrls: ['./introduction.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderBlockComponent, OptionsCardComponent, FooterBlockComponent, SvgImageButtonComponent]
})
export class IntroductionComponent {}
