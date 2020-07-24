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

  date = new Date()

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    this.videoService.getAllVideos().valueChanges
      .subscribe(result => {
        this.videos = result.data.videos;
        this.videos = Array.from(this.videos).sort((a: any, b: any) => (a.views < b.views) ? 1 : -1);
        this.videos = Array.from(this.videos).filter((vid: any) => vid.year == this.date.getFullYear());
        this.videos = Array.from(this.videos).filter((vid: any) => vid.month == this.date.getMonth() + 1);
        this.videos = Array.from(this.videos).filter((vid: any) => vid.day > this.date.getDate() - 6)
      })
  }

  

}
