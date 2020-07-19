import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-entertainment-category',
  templateUrl: './entertainment-category.component.html',
  styleUrls: ['./entertainment-category.component.scss']
})
export class EntertainmentCategoryComponent implements OnInit {

  videos: any;

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    this.videoService.getAllVideos()
      .valueChanges
      .subscribe((result) => {
          this.videos = result.data.videos;
          this.videos = Array.from(this.videos).filter((video: any) => video.category == "Entertainment");
      });
  }

}
