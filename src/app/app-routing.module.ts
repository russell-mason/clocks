import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashComponent } from './splash/splash.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { OptionsComponent } from './options/options.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
    { path: 'splash', component: SplashComponent },
    { path: 'introduction', component: IntroductionComponent },
    { path: 'options', component: OptionsComponent },
    { path: 'game', component: GameComponent },
    { path: '', pathMatch: 'full', redirectTo: 'splash' }
];

/**
 * Application routing.
 */
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
