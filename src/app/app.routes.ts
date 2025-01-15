import { Routes } from '@angular/router';





export const routes: Routes = [
    { path: 'splash', loadComponent: () => import('./splash/splash.component').then(m => m.SplashComponent) },
    { path: 'introduction', loadComponent: () => import('./introduction/introduction.component').then(m => m.IntroductionComponent) },
    { path: 'options', loadComponent: () => import('./options/options.component').then(m => m.OptionsComponent) },
    { path: 'game', loadComponent: () => import('./game/game.component').then(m => m.GameComponent) },
    { path: '', pathMatch: 'full', redirectTo: 'splash' }
];
