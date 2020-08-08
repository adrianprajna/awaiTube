import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/type';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-channel-about',
  templateUrl: './channel-about.component.html',
  styleUrls: ['./channel-about.component.scss']
})
export class ChannelAboutComponent implements OnInit {

  constructor(private route: ActivatedRoute, private channelService: ChannelService, private userService: UserService, private videoService: VideoService) { }

  id: number
  channel: any
  links: Array<any>
  user: User
  videos: Array<any>
  views: number = 0;
  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
        this.id = parseInt(paramMap.get('id'))
        this.channelService.getChannel(this.id).valueChanges
          .subscribe(result => {
            this.channel = result.data.channel
            this.getUser()
            this.links = JSON.parse(this.channel.links);
          })

    })


  }

  getUser(){
    this.userService.getUser(this.channel.user_id).valueChanges
      .subscribe(result => {
        this.user = result.data.getUser
        this.videoService.getAllVideos().valueChanges.subscribe(result =>{
          this.videos = result.data.videos
          this.videos = this.videos.filter((vid: any) => vid.user_id == this.user.id)
          console.log(this.videos);          
          this.videos.forEach((vid: any) => {
            this.views += vid.views;
          })
        })
      })
  }

}
