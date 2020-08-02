import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { YoutubePremiumComponent } from './youtube-premium/youtube-premium.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { TrendingComponent } from './trending/trending.component';
import { MusicCategoryComponent } from './category/music-category/music-category.component';
import { GameCategoryComponent } from './category/game-category/game-category.component';
import { SportCategoryComponent } from './category/sport-category/sport-category.component'
import { NewsCategoryComponent } from './category/news-category/news-category.component';
import { TravelCategoryComponent } from './category/travel-category/travel-category.component';
import { EntertainmentCategoryComponent } from './category/entertainment-category/entertainment-category.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { ChannelHomeComponent } from './channel/channel-home/channel-home.component';
import { UploaderComponent } from './upload/uploader/uploader.component';
import { ChannelVideosComponent } from './channel/channel-videos/channel-videos.component';
import { ChannelCommunityComponent } from './channel/channel-community/channel-community.component';
import { SearchComponent } from './search/search.component';



const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: "full", component:HomeComponent},
  {path: 'playlist/:id', component: PlaylistComponent},
  {path: 'channel/:id/home', component: ChannelHomeComponent},
  {path: 'channel/:id/videos', component: ChannelVideosComponent},
  {path: 'channel/:id/community', component: ChannelCommunityComponent},
  {path: 'search/:url', component: SearchComponent},
  {path: 'category/music', component: MusicCategoryComponent},
  {path: 'category/game', component: GameCategoryComponent},
  {path: 'category/sport', component: SportCategoryComponent},
  {path: 'category/news', component: NewsCategoryComponent},
  {path: 'category/travel', component: TravelCategoryComponent},
  {path: 'category/entertainment', component: EntertainmentCategoryComponent},
  {path: 'subscription', component: SubscriptionComponent},
  {path: 'premium', component: YoutubePremiumComponent},
  {path: 'trending', component: TrendingComponent},
  {path: 'video-detail/:id', component: VideoDetailComponent},
  {path: 'upload', component: UploaderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
