import { Directive, ElementRef, HostListener, AfterViewInit, inject } from '@angular/core';

/**
 * List of available viewport sizes and names (used as class names).
 * N.B. Order is important
 * Unlike media queries/css this will only match a single size. If an overlapping sizes is matched it will
 * replace the smaller size.
 *
 * Devices use the following compensations for UI chrome (width height):
 *
 * phones - landscape: -50px -80px
 * phones - portrait: 0px -180px
 * tablets: 70px 70px
 * desktops: 0px -140px
 */
const viewportSizes = [
    { miWidth: 0, minHeight: 0, name: 'viewport-desktop-minimum' },
    { miWidth: 670, minHeight: 280, name: 'viewport-phone-landscape' },
    { miWidth: 360, minHeight: 540, name: 'viewport-phone-portrait' },
    { miWidth: 790, minHeight: 330, name: 'viewport-phone-plus-landscape' },
    { miWidth: 410, minHeight: 660, name: 'viewport-phone-plus-portrait' },
    { miWidth: 640, minHeight: 460, name: 'viewport-desktop-small' },
    { miWidth: 530, minHeight: 930, name: 'viewport-tablet-portrait' },
    { miWidth: 930, minHeight: 530, name: 'viewport-tablet-landscape' },
    { miWidth: 960, minHeight: 650, name: 'viewport-desktop-reduced' },
    { miWidth: 750, minHeight: 1080, name: 'viewport-tablet-plus-portrait' },
    { miWidth: 1080, minHeight: 750, name: 'viewport-tablet-plus-landscape' },
    { miWidth: 1350, minHeight: 830, name: 'viewport-desktop' },
    { miWidth: 1900, minHeight: 910, name: 'viewport-desktop-hd' },
    { miWidth: 3800, minHeight: 2010, name: 'viewport-desktop-4k' }
];

/**
 * Directive that sets a class name indicating the current viewport size against the associated element.
 * Unlike media queries this is a single value matching the best fit. With media queries, when multiple sizes
 * match, they're all applied. This can make it difficult to coordinate multiple non-incremental screen sizes.
 *
 * @example
 * <div appTrackViewport></div>
 */
@Directive({
    standalone: true,
    selector: '[appTrackViewport]'
})
export class TrackViewportDirective implements AfterViewInit {
    private element = inject(ElementRef);

    /**
     * Sets the class once the full view is available.
     */
    public ngAfterViewInit(): void {
        this.setViewportClass();
    }

    /**
     *  Sets the class ever time the window changes size.
     */
    @HostListener('window:resize', ['$event'])
    private handleElementOnResize(event: any): void {
        this.setViewportClass();
    }

    private setViewportClass() {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        const viewportSizeName = this.matchSize(width, height);

        this.replaceViewportClass(viewportSizeName);
    }

    private matchSize(width: number, height: number) {
        let match = '';

        for (const viewportSize of viewportSizes) {
            if (width >= viewportSize.miWidth && height >= viewportSize.minHeight) {
                match = viewportSize.name;
            }
        }

        return match;
    }

    private replaceViewportClass(viewportSizeName: string) {
        for (const viewportSize of viewportSizes) {
            this.element.nativeElement.classList.remove(viewportSize.name);
        }

        this.element.nativeElement.classList.add(viewportSizeName);
    }
}
