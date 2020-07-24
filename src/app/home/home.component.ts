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
  columns: number = 8;
  displayedVideos: number = 8;

  observer: IntersectionObserver;
  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
  
    this.videoService.getAllVideos().valueChanges.subscribe(results => {
      this.videos = results.data.videos;
    })

    this.observer = new IntersectionObserver(entry => {
      if(entry[0].isIntersecting){
        
        for(let i = 0; i < this.columns; i++){
          if(this.displayedVideos < this.videos.length){
            let div = document.createElement('div');
            let video = document.createElement('app-video')
            video.setAttribute('video', 'this.videos[this.displayedVideos]');
            div.appendChild(video);
            let row = document.querySelector('.row');
            row.appendChild(div);
            this.displayedVideos++;
          }
        }
      }
    })

    this.observer.observe(document.getElementById('footer'));
  }

  addDropdown(): void{
    this.isSettingsDrop = !this.isSettingsDrop;
  }
}
