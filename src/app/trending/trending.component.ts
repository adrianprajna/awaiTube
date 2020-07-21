import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
import { User } from '../type';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {

  videos: any;

  settings: boolean = false;

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    this.videoService.getAllVideos().valueChanges
      .subscribe(result => {
        this.videos = result.data.videos;
        this.videos = Array.from(this.videos).sort((a: any, b: any) => (a.views < b.views) ? 1 : -1);
      })
  }

  

}
