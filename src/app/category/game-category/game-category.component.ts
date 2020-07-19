import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-game-category',
  templateUrl: './game-category.component.html',
  styleUrls: ['./game-category.component.scss']
})
export class GameCategoryComponent implements OnInit {

  videos: any;

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {

    this.videoService.getAllVideos()
      .valueChanges
      .subscribe((result) => {
          this.videos = result.data.videos;
          this.videos = Array.from(this.videos).filter((video: any) => video.category == "Game");
      });

  }

}
