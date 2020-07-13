import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { SubscriptionComponent } from './subscription/subscription.component';
import { YoutubePremiumComponent } from './youtube-premium/youtube-premium.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider} from 'angularx-social-login'
import { LoginService } from '../app/services/login.service';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { TrendingComponent } from './trending/trending.component';
import { MusicCategoryComponent } from './category/music-category/music-category.component';
import { VideoComponent } from './video-detail/video/video.component';
import { SportCategoryComponent } from './category/sport-category/sport-category.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    SubscriptionComponent,
    YoutubePremiumComponent,
    VideoDetailComponent,
    TrendingComponent,
    MusicCategoryComponent,
    VideoComponent,
    SportCategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    SocialLoginModule
  ],
  providers: [
    {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '920945328804-tpa4dflsqah0fpv1hl5ocarq49aed0v0.apps.googleusercontent.com'
          ),
        },
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('305610227239024'),
        },
      ],
    } as SocialAuthServiceConfig,
  },
  LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
