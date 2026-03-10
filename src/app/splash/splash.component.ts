import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderBlockComponent } from 'app/shared';

/**
 * Component that represents a splash screen to display an application image.
 * This isn't a real splash screen, that's handled in the index.html page using a simple message.
 */
@Component({
    selector: 'app-splash',
    templateUrl: './splash.component.html',
    styleUrls: ['./splash.component.scss'],
    imports: [HeaderBlockComponent]
})
export class SplashComponent {
    private router = inject(Router);

    /**
     * Creates an instance of SplashComponent.
     */
    constructor() {
        timer(2000)
            .pipe(
                tap(() => this.router.navigateByUrl('introduction')),
                takeUntilDestroyed()
            )
            .subscribe();
    }
}
