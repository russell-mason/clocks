import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Theme, OptionsService } from 'app/shared/options';
import { SvgStoreComponent, ResponsiveGuideComponent, TrackViewportDirective } from 'app/shared';
import { environment } from 'src/environments/environment';

/**
 * Main application component.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [CommonModule, RouterModule, SvgStoreComponent, ResponsiveGuideComponent, TrackViewportDirective]
})
export class AppComponent {
    private optionsService = inject(OptionsService);

    /**
     * Gets a value indicating whether to show the responsive guide.
     */
    public showGuide = environment.showGuide;

    /**
     * Gets or sets the current theme for styling purposes.
     */
    public theme = computed(() => Theme[this.optionsService.gameOptions().theme]);
}
