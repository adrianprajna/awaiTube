import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-sport-category',
  templateUrl: './sport-category.component.html',
  styleUrls: ['./sport-category.component.scss']
})
export class SportCategoryComponent implements OnInit {

  videos: any;
  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    this.videoService.getAllVideos()
      .valueChanges
      .subscribe((result) => {
          this.videos = result.data.videos;
          this.videos = Array.from(this.videos).filter((video: any) => video.category == "Sport");
      });
  }

}
