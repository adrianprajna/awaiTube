import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isSettingsDrop:boolean = false;
  
  videos: any
  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
  
    this.videoService.getAllVideos().valueChanges.subscribe(results => {
      this.videos = results.data.videos;
    })
  }

  addDropdown(): void{
    this.isSettingsDrop = !this.isSettingsDrop;
  }
}
