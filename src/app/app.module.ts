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
import { UserService } from '../app/services/user.service';
import { VideoService } from '../app/services/video.service';
import { CommentService } from '../app/services/comment.service'
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { TrendingComponent } from './trending/trending.component';
import { MusicCategoryComponent } from './category/music-category/music-category.component';
import { VideoComponent } from './video-detail/video/video.component';
import { SportCategoryComponent } from './category/sport-category/sport-category.component';
import { GameCategoryComponent } from './category/game-category/game-category.component';
import { NewsCategoryComponent } from './category/news-category/news-category.component';
import { TravelCategoryComponent } from './category/travel-category/travel-category.component';
import { EntertainmentCategoryComponent } from './category/entertainment-category/entertainment-category.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { ChannelHomeComponent } from './channel/channel-home/channel-home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatVideoModule } from 'mat-video';
import { UploadComponent } from './upload/upload.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage'
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { environment } from '../environments/environment';
import { firestore } from 'firebase';
import { DropzoneDirective } from './dropzone.directive';
import { UploaderComponent } from './upload/uploader/uploader.component';
import { UploadTaskComponent } from './upload/upload-task/upload-task.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from './video-detail/comment/comment.component';
import { ReplyComponent } from './video-detail/reply/reply.component';

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
    SportCategoryComponent,
    GameCategoryComponent,
    NewsCategoryComponent,
    TravelCategoryComponent,
    EntertainmentCategoryComponent,
    PlaylistComponent,
    ChannelHomeComponent,
    UploadComponent,
    DropzoneDirective,
    UploaderComponent,
    UploadTaskComponent,
    CommentComponent,
    ReplyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    MatVideoModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule
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
  LoginService,
  UserService,
  VideoService,
  CommentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
