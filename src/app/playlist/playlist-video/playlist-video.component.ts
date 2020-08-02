import { Component, OnInit, Input } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { User } from 'src/app/type';
import { UserService } from 'src/app/services/user.service';
import { ChannelService } from 'src/app/services/channel.service';
import { PlaylistService } from 'src/app/playlist.service';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist-video',
  templateUrl: './playlist-video.component.html',
  styleUrls: ['./playlist-video.component.scss']
})
export class PlaylistVideoComponent implements OnInit {

  @Input() video: any;
  @Input() playlist: any;

  vid: any;

  user: User;

  channel: any;

  id: number;

  ranges = [
    { divider: 1e18 , suffix: 'E' },
    { divider: 1e15 , suffix: 'P' },
    { divider: 1e12 , suffix: 'T' },
    { divider: 1e9 , suffix: 'B' },
    { divider: 1e6 , suffix: 'M' },
    { divider: 1e3 , suffix: 'k' }
  ];

  constructor(private videoService: VideoService, private userService: UserService, private channelService: ChannelService, private playlistService: PlaylistService, private route: ActivatedRoute, private apollo :Apollo) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(paramMap => {
        this.id = parseInt(paramMap.get('id'));
    })

    this.videoService.getVideo(this.video.id).valueChanges
      .subscribe(result => {
        this.vid = result.data.getVideo
        
        this.userService.getUser(this.vid.user_id).valueChanges
          .subscribe(res => {
            this.user = res.data.getUser;
            this.getChannel(this.user.id as any);
          })
      })
  }

  getVideoLength(totalSeconds: number): string{
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
  
    if(hours > 0){
      return String(hours).padStart(2, "0") + ":" + 
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    }else{
      return String(minutes).padStart(2, "0") + 
      ":" + String(seconds).padStart(2, "0");
    }
  }

  convertViewToString(views: number): string {
    for(let i: number = 0; i < this.ranges.length; i++){
      if(views >= this.ranges[i].divider){
        return Math.floor((views / this.ranges[i].divider)).toString() + this.ranges[i].suffix
      }
    }

    return views.toString();
  } 

  getUploadedDate(): string{
    let today = new Date();
    let date: number;
    
    if(today.getFullYear() > this.vid.year){
      return today.getFullYear() - this.vid.year == 1 ? (today.getFullYear() - this.vid.year).toString() + " year ago" : (today.getFullYear() - this.vid.year).toString() + " years ago"
    }

    if(today.getMonth() + 1 > this.vid.month){
      return (today.getMonth() - this.vid.month + 1) == 1 ? (today.getMonth() - this.vid.month + 1).toString() + " month ago" : (today.getMonth() - this.vid.month + 1).toString() + " months ago"
    }

    if(today.getDate() > this.vid.day){
      return (today.getDate() - this.vid.day) == 1 ? (today.getDate() - this.vid.day).toString() + " days ago" : (today.getDate() - this.vid.day).toString() + " days ago"
    }

    let video_time: any = JSON.parse(this.vid.time)
   

    if(today.getHours() > video_time.hour){
      return (today.getHours() - video_time.hour) == 1 ? (today.getHours() - video_time.hour).toString() + " hour ago" : (today.getHours() - video_time.hour).toString() + " hours ago"
    }

    if(today.getMinutes() > video_time.minute){
      return (today.getMinutes() - video_time.minute) == 1 ? (today.getMinutes() - video_time.minute).toString() + " minute ago" : (today.getMinutes() - video_time.minute).toString() + " minutes ago"
    }

    if(today.getSeconds() > video_time.second){
      return (today.getSeconds() - video_time.second).toString() + " seconds ago"
    }
  }

  getChannel(user_id: number){
    this.channelService.getChannelByUser(user_id).valueChanges
      .subscribe(res => this.channel = res.data.getChannelByUser)
  }

  addDropdown(e, id: number): void{
    if((e.target as HTMLElement).classList.contains('fa-ellipsis-v')){
      let dropdown = document.getElementById(`${id}`);
      dropdown.classList.toggle('block');
    }
  }

  remove(vid_id: number){
    let date = new Date();

    let dropdown = document.getElementById(`${vid_id}`);
    dropdown.classList.toggle('block');
    
    let videos: Array<any> = JSON.parse(this.playlist.videos);
   
    videos.forEach((video, index) => {
      if(video.id == vid_id){
        videos.splice(index, 1);
      }
    })

    this.apollo.mutate({
      mutation: this.playlistService.updateQuery,
      variables: {
        id: this.id,
        user_id: this.playlist.user_id,
        name: this.playlist.name,
        privacy: this.playlist.privacy,
        description: this.playlist.description,
        views: this.playlist.views,
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        videos: JSON.stringify(videos)
      },
      refetchQueries: [{
        query: gql `
          query getPlaylist($id: ID!){
            playlist(id: $id){
              user_id
              name
              privacy
              description
              views
              day
              month
              year
              videos
            }
          }
        `,
        variables: {
          id: this.id
        }
      }]
    }).subscribe(res => console.log(res.data))
  }
}
