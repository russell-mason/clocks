import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
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
export class SplashComponent implements OnInit, OnDestroy {
    private router = inject(Router);

    private subscriptions = new SubSink();

    /**
     * Starts a timer to automatically navigate to the introduction page.
     */
    public ngOnInit(): void {
        const timeout$ = interval(2000).pipe(tap(_ => this.router.navigateByUrl('introduction')));

        this.subscriptions.add(timeout$.subscribe());
    }

    /**
     * Clean up reactive subscriptions.
     */
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
