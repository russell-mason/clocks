import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Component that represents a simple page header strip with a title.
 */
@Component({
    standalone: true,
    selector: 'app-header-block',
    templateUrl: './header-block.component.html',
    styleUrls: ['./header-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderBlockComponent {
    /**
     * Gets or sets the text to display.
     */
    @Input()
    public heading: string;
}
