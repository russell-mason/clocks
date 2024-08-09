import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Component that represents a simple page footer strip with a title and custom content.
 */
@Component({
    standalone: true,
    selector: 'app-footer-block',
    templateUrl: './footer-block.component.html',
    styleUrls: ['./footer-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterBlockComponent {
    /**
     * Gets or sets the text to display.
     */
    @Input()
    public heading: string;
}
