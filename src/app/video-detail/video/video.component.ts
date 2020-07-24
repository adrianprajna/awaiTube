import { Component, OnInit ,Input} from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { User } from '../../type'
import { UserService } from 'src/app/services/user.service';
import { ChannelService } from 'src/app/services/channel.service';

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

  ranges = [
    { divider: 1e18 , suffix: 'E' },
    { divider: 1e15 , suffix: 'P' },
    { divider: 1e12 , suffix: 'T' },
    { divider: 1e9 , suffix: 'B' },
    { divider: 1e6 , suffix: 'M' },
    { divider: 1e3 , suffix: 'k' }
  ];

  constructor(private loginService: LoginService, private userService: UserService, private channelService: ChannelService) { }

  ngOnInit(): void {

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

  getChannel(user_id: number){
    this.channelService.getChannelByUser(user_id).valueChanges
      .subscribe(res => this.channel = res.data.getChannelByUser);
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
