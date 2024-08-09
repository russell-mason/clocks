import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { Theme, OptionsService } from 'app/shared/options';
import { SvgStoreComponent, ResponsiveGuideComponent, TrackViewportDirective } from 'app/shared';

/**
 * Main application component.
 */
@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [CommonModule, RouterModule, SvgStoreComponent, ResponsiveGuideComponent, TrackViewportDirective]
})
export class AppComponent implements OnInit, OnDestroy {
    private subscriptions: SubSink = new SubSink();

    /**
     * Creates an instance of AppComponent.
     */
    constructor(private optionsService: OptionsService) {}

    /**
     * Gets or sets the name of the current theme for styling purposes.
     */
    public themeName: string;

    /**
     * Load user options from storage and setup reactive subscriptions for themes.
     */
    public ngOnInit(): void {
        this.optionsService.load();

        this.subscriptions.add(
            this.optionsService.gameOptions$
                .pipe(
                    tap(gameOptions => {
                        this.themeName = Theme[gameOptions.theme];
                    })
                )
                .subscribe()
        );
    }

    /**
     * Cleans up reactive subscriptions.
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
