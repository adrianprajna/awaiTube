import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isSettingsDrop:boolean = false;
  
  videos: Array<any>;
  randomVideos: Array<any> = new Array
  takenVideos: Array<any> = new Array
  columns: number = 8;
  displayedVideos: number = 8;

  firstGet: boolean = false;

  prioritizedVideos: Array<any> = new Array;

  observer: IntersectionObserver;
  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
  
    this.videoService.getAllVideos().valueChanges.subscribe(results => {
      this.randomVideos = results.data.videos;

      this.videoService.locationObservable.subscribe(location => {
        this.prioritizedVideos = [...this.randomVideos];
        this.prioritizedVideos = this.prioritizedVideos.filter((vid: any) => vid.location == location)
        this.prioritizedVideos = this.shuffle(this.prioritizedVideos) 

        this.videos = new Array
        for(let i = 0; i < this.randomVideos.length; i++){
          if(!this.prioritizedVideos.includes(this.randomVideos[i])){
            this.videos.push(this.randomVideos[i]);
          }
        }      
        this.videos = this.shuffle(this.videos)
      })
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

  rand(min: number, max: number) {
    let randomNum = Math.random() * (max - min) + min;
    return Math.floor(randomNum);
  }

  getRandomVideos():void{

    for(let i = 0; i < this.videos.length; i++){
      let random = Math.floor(Math.random() * this.videos.length)
      
      if(i == this.videos.length){
        break;
      }

      if(!this.takenVideos.includes(this.videos[random].id)){        
        this.randomVideos.push(this.videos[random])
        this.takenVideos.push(this.videos[random].id)
      }
      else{
        i--
      }
    }
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  


}
