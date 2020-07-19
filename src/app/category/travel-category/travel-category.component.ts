import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-travel-category',
  templateUrl: './travel-category.component.html',
  styleUrls: ['./travel-category.component.scss']
})
export class TravelCategoryComponent implements OnInit {

  videos: any;

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    this.videoService.getAllVideos()
      .valueChanges
      .subscribe((result) => {
          this.videos = result.data.videos;
          this.videos = Array.from(this.videos).filter((video: any) => video.category == "Travel");
      });
  }

}