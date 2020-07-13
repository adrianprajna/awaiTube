import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { YoutubePremiumComponent } from './youtube-premium/youtube-premium.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { TrendingComponent } from './trending/trending.component';
import { MusicCategoryComponent } from './category/music-category/music-category.component';



const routes: Routes = [
  {path: 'category/music', component: MusicCategoryComponent},
  {path: 'subscription', component: SubscriptionComponent},
  {path: 'premium', component: YoutubePremiumComponent},
  {path: 'trending', component: TrendingComponent},
  {path: 'video-detail', component: VideoDetailComponent},
  {path: '', component: HomeComponent, pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
