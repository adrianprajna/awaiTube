import { Component, OnInit ,Input} from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { User, Obj } from '../../type'
import { UserService } from 'src/app/services/user.service';
import { ChannelService } from 'src/app/services/channel.service';
import { PlaylistService } from 'src/app/playlist.service';
import { Apollo } from 'apollo-angular';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @Input() video;

  isSettingsDrop: boolean = false;
  isLoggedIn: Boolean;
  length: number;
  
  user: User
  channel: any;

  userPlaylist: User

  isModalDrop: boolean = false;
  createDropdown: boolean = false;
  
  playlists: Array<any> = new Array;
  
  playlist_json: Array<Obj>

  loginUser: SocialUser

  ranges = [
    { divider: 1e18 , suffix: 'E' },
    { divider: 1e15 , suffix: 'P' },
    { divider: 1e12 , suffix: 'T' },
    { divider: 1e9 , suffix: 'B' },
    { divider: 1e6 , suffix: 'M' },
    { divider: 1e3 , suffix: 'k' }
  ];

  constructor(private loginService: LoginService, private userService: UserService, private channelService: ChannelService, private playlistService: PlaylistService, private apollo: Apollo) { }

  ngOnInit(): void {

    if(localStorage.getItem('users') != null){
      this.loginService.getUserFromStorage();
      this.loginUser = this.loginService.user;
      this.getUserByEmail(this.loginUser.email)
  }

    this.userService.getUser(this.video.user_id).valueChanges.subscribe(result => {
        this.user = result.data.getUser;
        this.getChannel(this.user.id as any);
    })

    this.loginService.currentLoggedIn.subscribe(login => this.isLoggedIn = login);
    this.check(); 
    this.getUploadedDate()
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

  getChannel(user_id: number){
    this.channelService.getChannelByUser(user_id).valueChanges
      .subscribe(res => this.channel = res.data.getChannelByUser);
  }

  getUserByEmail(email: string){
    this.userService.getUserByEmail(email).valueChanges
      .subscribe(result => {
        this.userPlaylist = result.data.getUserByEmail
        this.playlist_json = JSON.parse(this.userPlaylist.playlists)
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
            this.playlists = this.playlists.filter((playlist: any) => playlist.user_id == this.userPlaylist.id)                   
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
    
    this.playlistService.createPlaylist(this.userPlaylist.id as any, input.value, privacy, "this is a description")
      .subscribe((res: any) => {
       
        let id: Obj = {
          id: parseInt(res.data.createPlaylist.id)
        }
        this.playlist_json.push(id)
        console.log(this.playlist_json);
        
        this.apollo.mutate({
          mutation: this.userService.updateUserQuery,
          variables: {
          id: this.userPlaylist.id,
          name: this.userPlaylist.name,
          email: this.userPlaylist.email,
          img_url: this.userPlaylist.img_url,
          premium: this.userPlaylist.premium,
          subscribers: this.userPlaylist.subscribers,
          liked_video: this.userPlaylist.liked_video,
          disliked_video: this.userPlaylist.disliked_video,
          liked_comment: this.userPlaylist.liked_comment,
          disliked_comment: this.userPlaylist.disliked_comment,
          subscribed_channel: this.userPlaylist.subscribed_channel,
          playlists: JSON.stringify(this.playlist_json),
          liked_post: this.userPlaylist.liked_post,
          disliked_post: this.userPlaylist.disliked_post
          }
        }).subscribe()

      })

  }

  addCreateDropdown(): void {
    this.createDropdown  = !this.createDropdown;
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

  check(){
    document.addEventListener("DOMContentLoaded", () => {
        let p = document.getElementById('t');
        this.length = p.textContent.length;
        console.log(p);
    })
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

}
