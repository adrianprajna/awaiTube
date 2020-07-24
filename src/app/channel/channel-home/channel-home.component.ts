import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  ChannelService
} from 'src/app/services/channel.service';
import {
  UserService
} from 'src/app/services/user.service';
import {
  User
} from 'src/app/type';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-channel-home',
  templateUrl: './channel-home.component.html',
  styleUrls: ['./channel-home.component.scss']
})
export class ChannelHomeComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private channelService: ChannelService, private userService: UserService, private videoService: VideoService) {}

  id: number
  channel: any;
  videos: any;
  user: User;

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id'));
      this.getChannel();
    })

  }

  getChannel() {
    this.channelService.getChannel(this.id).valueChanges
    .subscribe(result => {
      this.channel = result.data.channel;
      this.getUser();
    })
  }

  getUser(){
    this.userService.getUser(this.channel.user_id).valueChanges
    .subscribe(res => {
      this.user = res.data.getUser;
      this.getAllVideos();
    });
  }

  getAllVideos(){
    this.videoService.getAllVideos().valueChanges
      .subscribe(result => {
          this.videos = result.data.videos;
          this.videos = Array.from(this.videos).filter((video: any) => video.user_id == this.user.id)
          console.log(this.videos);          
          this.videos = Array.from(this.videos).sort((a: any, b: any) => b.id - a.id);      
          console.log(this.videos);          
      })
  }

  navigate(link: string){
    window.location.href = `/channel/${this.id}/${link}`
  }

}
