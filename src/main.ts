import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [provideZoneChangeDetection(), provideRouter(routes)]
}).catch(err => console.error(err));
