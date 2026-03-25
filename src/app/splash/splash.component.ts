import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
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
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    /**
     * Creates an instance of SplashComponent.
     */
    constructor() {
        const id = window.setTimeout(() => {
            void this.router.navigateByUrl('introduction');
        }, 2000);

        this.destroyRef.onDestroy(() => clearTimeout(id));
    }
}
