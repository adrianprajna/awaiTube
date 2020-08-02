import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User, Obj } from 'src/app/type';
import { ChannelService } from 'src/app/services/channel.service';
import { SocialUser } from 'angularx-social-login';
import { LoginService } from 'src/app/services/login.service';
import { PlaylistService } from 'src/app/playlist.service';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-video-trending',
  templateUrl: './video-trending.component.html',
  styleUrls: ['./video-trending.component.scss']
})
export class VideoTrendingComponent implements OnInit {

  @Input() video: any;
  userVideo: User;
  user: User;
  settings: boolean = false;
  channel: any;
  isModalDrop: boolean = false;

  loginUser: SocialUser;
  playlists: Array<any> = new Array;

  createDropdown: boolean = false;

  playlist_json: Array<Obj>
  
  ranges = [
    { divider: 1e18 , suffix: 'E' },
    { divider: 1e15 , suffix: 'P' },
    { divider: 1e12 , suffix: 'T' },
    { divider: 1e9 , suffix: 'B' },
    { divider: 1e6 , suffix: 'M' },
    { divider: 1e3 , suffix: 'k' }
  ];

  constructor(private userService: UserService, private channelService: ChannelService, private loginService: LoginService, private playlistService: PlaylistService, private apollo: Apollo) { }

  ngOnInit(): void {  

    if(localStorage.getItem('users') != null){
        this.loginService.getUserFromStorage();
        this.loginUser = this.loginService.user;
        this.getUserByEmail(this.loginUser.email)
    }
    this.getChannel();

    this.userService.getUser(this.video.user_id).valueChanges
      .subscribe(result => {
        this.userVideo = result.data.getUser;
      })
  }
  
  getUserByEmail(email: string){
    this.userService.getUserByEmail(email).valueChanges
      .subscribe(result => {
        this.user = result.data.getUserByEmail
        this.playlist_json = JSON.parse(this.user.playlists)
        this.getAllPlaylist(this.playlist_json);   
      })
  }

  getAllPlaylist(playlist_json: Array<Obj>){
    playlist_json.forEach((playlist: any) => {
        this.playlistService.getPlaylist(playlist.id).valueChanges
          .subscribe(res => {
            if(this.playlists.length != 0){
              if(!this.playlists.includes(res.data.playlist))
                  this.playlists.push(res.data.playlist)
            } else {
              this.playlists.push(res.data.playlist)
            }   
            this.playlists = this.playlists.filter((playlist: any) => playlist.user_id == this.user.id)                   
          })
    })
  }

  createPlaylist(){
    let input = document.getElementById('input-create') as HTMLInputElement
    let privacy = "Public";
    let privacies = document.getElementsByName('privacy');

    privacies.forEach(p => {
      if((p as HTMLInputElement).checked && (p as HTMLInputElement).value == "Private") {
        privacy = "Private";
      }
    })
    
    this.playlistService.createPlaylist(this.user.id as any, input.value, privacy, "this is a description")
      .subscribe((res: any) => {
       
        let id: Obj = {
          id: parseInt(res.data.createPlaylist.id)
        }
        this.playlist_json.push(id)
        console.log(this.playlist_json);
        
        this.apollo.mutate({
          mutation: this.userService.updateUserQuery,
          variables: {
          id: this.user.id,
          name: this.user.name,
          email: this.user.email,
          img_url: this.user.img_url,
          premium: this.user.premium,
          subscribers: this.user.subscribers,
          liked_video: this.user.liked_video,
          disliked_video: this.user.disliked_video,
          liked_comment: this.user.liked_comment,
          disliked_comment: this.user.disliked_comment,
          subscribed_channel: this.user.subscribed_channel,
          playlists: JSON.stringify(this.playlist_json)
          }
        }).subscribe()

      })

  }

  getChannel(){
    this.channelService.getChannelByUser(this.video.user_id).valueChanges
      .subscribe(res => this.channel = res.data.getChannelByUser)
  }

  addDropdown(e, id: number): void{
    if((e.target as HTMLElement).classList.contains('fa-ellipsis-v')){
      let dropdown = document.getElementById(`${id}`);
      dropdown.classList.toggle('block');
    }
  }

  addModal(): void {
    this.isModalDrop = !this.isModalDrop
    this.playlistService.videoBehaviour.next(this.video.id);
  }
  
  addCreateDropdown(): void {
    this.createDropdown  = !this.createDropdown;
  }

  addSettings(){
    this.settings = !this.settings;
  }



  getUploadedDate(): string{
    let today = new Date();
    let date: number;
    
    if(today.getFullYear() > this.video.year){
      return today.getFullYear() - this.video.year == 1 ? (today.getFullYear() - this.video.year).toString() + " year ago" : (today.getFullYear() - this.video.year).toString() + " years ago"
    }

    if(today.getMonth() + 1 > this.video.month){
      return (today.getMonth() - this.video.month + 1) == 1 ? (today.getMonth() - this.video.month + 1).toString() + " month ago" : (today.getMonth() - this.video.month + 1).toString() + " months ago"
    }

    if(today.getDate() > this.video.day){
      return (today.getDate() - this.video.day) == 1 ? (today.getDate() - this.video.day).toString() + " days ago" : (today.getDate() - this.video.day).toString() + " days ago"
    }

    let video_time: any = JSON.parse(this.video.time)
   

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

}
