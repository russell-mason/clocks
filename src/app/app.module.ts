import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { CardComponent } from './shared/card/card.component';
import { CardHeadingComponent } from './shared/card-heading/card-heading.component';
import { CardContentComponent } from './shared/card-content/card-content.component';
import { HeaderBlockComponent } from './shared/header-block/header-block.component';
import { FooterBlockComponent } from './shared/footer-block/footer-block.component';
import { ClockFaceComponent } from './shared/clock-face/clock-face.component';
import { NumberPadComponent } from './shared/number-pad/number-pad.component';
import { SvgStoreComponent } from './shared/svg-store/svg-store.component';
import { SvgImageButtonComponent } from './shared/svg-image-button/svg-image-button.component';
import { ResponsiveGuideComponent } from './shared/responsive-guide/responsive-guide.component';
import { EnterClickDirective } from './shared/directives/enter-click.directive';
import { InitialFocusDirective } from './shared/directives/initial-focus.directive';
import { TrackViewportDirective } from './shared/directives/track-viewport.directive';
import { AppComponent } from './app.component';
import { SplashComponent } from './splash/splash.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { OptionsComponent } from './options/options.component';
import { OptionsCardComponent } from './options-card/options-card.component';
import { GameComponent } from './game/game.component';
import { GamePendingComponent } from './game-pending/game-pending.component';
import { GameMemorizeComponent } from './game-memorize/game-memorize.component';
import { GameRecallComponent } from './game-recall/game-recall.component';
import { ScoresComponent } from './scores/scores.component';
import { GameScoreCardComponent } from './game-score-card/game-score-card.component';
import { SessionScoreCardComponent } from './session-score-card/session-score-card.component';

@NgModule({
    declarations: [
        AppComponent,
        SplashComponent,
        IntroductionComponent,
        OptionsComponent,
        GameComponent,
        GamePendingComponent,
        GameMemorizeComponent,
        HeaderBlockComponent,
        FooterBlockComponent,
        GameRecallComponent,
        ScoresComponent,
        ClockFaceComponent,
        SvgStoreComponent,
        SvgImageButtonComponent,
        EnterClickDirective,
        GameScoreCardComponent,
        SessionScoreCardComponent,
        CardComponent,
        NumberPadComponent,
        InitialFocusDirective,
        ResponsiveGuideComponent,
        TrackViewportDirective,
        CardHeadingComponent,
        CardContentComponent,
        OptionsCardComponent
    ],
    imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
