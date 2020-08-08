import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';
import { ChannelService } from 'src/app/services/channel.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/type';

@Component({
  selector: 'app-channel-videos',
  templateUrl: './channel-videos.component.html',
  styleUrls: ['./channel-videos.component.scss']
})
export class ChannelVideosComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private channelService: ChannelService, private userService: UserService, private videoService: VideoService) { }

  id: number
  channel: any;
  videos: any;
  user: User;
  observer: IntersectionObserver
  dropSort: boolean = false;

  displayedVideos = 4;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id'));
      this.getChannel(this.id);
    })

    this.observer = new IntersectionObserver(entry => {
      if(entry[0].isIntersecting){
        
        for(let i = 0; i < 4; i++){
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

  getChannel(id: number) {
    this.channelService.getChannel(id).valueChanges
    .subscribe(result => {
      this.channel = result.data.channel;
      this.getUser(this.channel.user_id);
    })
  }

  getUser(user_id: number){
    this.userService.getUser(user_id).valueChanges
    .subscribe(res => {
      this.user = res.data.getUser;
      this.getAllVideos(this.user.id);
    });
  }

  getAllVideos(id: bigint){
    this.videoService.getAllVideos().valueChanges
      .subscribe(result => {
          this.videos = result.data.videos;
          this.videos = Array.from(this.videos).filter((video: any) => video.user_id == id)        
          this.videos = Array.from(this.videos).sort((a: any, b: any) => b.id - a.id);              
      })
  }

  addDropSort(){
    this.dropSort = !this.dropSort;
  }

  getMostPopular(){
    this.videos = Array.from(this.videos).sort((a: any, b:any) => b.views - a.views);
    this.addDropSort()
  }

  getOldest(){
    this.videos = Array.from(this.videos).sort((a: any, b:any) => a.id - b.id);
    this.addDropSort()
  }

  getNewest(){
    this.videos = Array.from(this.videos).sort((a: any, b:any) => b.id - a.id);
    this.addDropSort()
  }
}
